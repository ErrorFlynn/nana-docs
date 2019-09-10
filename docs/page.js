window.onload = function()
{	
	makeCollapsableSections();
	makeCollapsableRows();
	
	var headers = document.querySelectorAll('table.functions th');
	headers.forEach(header =>
	{
		header.setAttribute("colspan", "2");
		header.style["text-align"] = "left";
	});
};

function makeCollapsableRows()
{
	var tables = document.querySelectorAll('section > table');
	tables.forEach(table =>
	{
		if(table.className.length == 0)
			table.className = 'normal';
		var rows = table.querySelectorAll('tr');
		for(n = 0; n < rows.length; n++)
		{
			var hiddenCell = rows[n].querySelector('td:only-child');
			if(hiddenCell)
			{
				var linkCell = rows[n-1].querySelector('td:first-child');
				if(linkCell)
				{
					rows[n-1].className = 'clickable-row';
					hiddenCell.setAttribute('colspan', '2');
					rows[n].toggleAttribute('hidden');
					let span = document.createElement('span');
					span.className = 'clickable-cell';
					let linkText = linkCell.textContent;
					let verText = '';
					let pos = linkText.indexOf('(Nana');
					if(pos != -1)
					{
						verText = linkText.substr(pos);
						linkText = linkText.slice(0, pos-1);
					}
					span.textContent = linkText
					linkCell.textContent = '';
					linkCell.appendChild(span);

					if(verText.length)
					{
						let verspan = document.createElement('span');
						verspan.textContent = verText;
						verspan.className = 'ver';
						linkCell.appendChild(verspan);
						verspan.title = 'available since ' + verText.replace(/[()]/g, '');
					}

					span.addEventListener('click', function()
					{
						var hiddenRow = this.parentElement.parentElement.nextElementSibling;
						if(hiddenRow.hasAttribute('hidden'))
						{
							hiddenRow.removeAttribute('hidden');
							hiddenRow.scrollIntoView({behavior: 'smooth', block: 'center'});
						}
						else hiddenRow.setAttribute('hidden', '');
					});
				}
			}
		}
	});	
}

function makeCollapsableSections()
{
	var sections = document.querySelectorAll('section > section');
	if(sections.length < 2) return;
	sections.forEach(section =>
	{
		var h2 = section.querySelector('h2');
		if(h2)
		{
			if(!section.hasAttribute('expanded'))
			{
				h2.style['margin-bottom'] = '-20px';
				h2.insertAdjacentText('afterbegin', '[+] ');
				var siblings = section.querySelectorAll('h2 ~ *');
				siblings.forEach(sibling =>
				{
					sibling.setAttribute('hidden', '');
				});
			}
			else h2.insertAdjacentText('afterbegin', '[-] ');
			h2['className'] = 'linkified-heading';
			
			h2.addEventListener("click", event =>
			{
				var el = event.target;
				var c = el.textContent.charAt(1);
				
				if(c == '+') // expanding
				{
					el.style['margin-bottom'] = '';
					el.textContent = el.textContent.replace('+', '-');
					var siblings = section.querySelectorAll('h2 ~ *');
					siblings.forEach(sibling =>
					{
						sibling.removeAttribute('hidden');
					});
				}
				else // collapsing
				{
					el.style['margin-bottom'] = '-20px';
					el.textContent = el.textContent.replace('-', '+');
					var siblings = section.querySelectorAll('h2 ~ *');
					siblings.forEach(sibling =>
					{
						sibling.setAttribute('hidden', '');
					});
				}
			}, false);
		}
	});
}
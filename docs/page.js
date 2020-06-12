onload = function()
{
	// if this document was loaded in an iframe, and the owner document hasn't modified it (using index.js)
	if(window.frameElement && !window.frameElement.onload)
		return; // index.js modifies this document, causing it to load a second time; only run this code once, after it was modified
	makeCollapsableSections();
	makeCollapsableRows();
	
	var headers = document.querySelectorAll('table.functions th');
	headers.forEach(header =>
	{
		header.setAttribute("colspan", "2");
		header.style["text-align"] = "left";
	});
	headers = document.querySelectorAll('table.functions>tbody>tr>td table.normal th');
	headers.forEach(header =>
	{
		header.setAttribute("colspan", "1");
		header.style["text-align"] = "center";
	});

	var cfimgs = document.querySelectorAll('div.crossfade img:last-child');
	if(cfimgs.length)
	{
		setInterval(function()
		{
			cfimgOpacityOff();
			setTimeout(cfimgOpacityOn, 2000);
		}, 10000);

		function cfimgOpacityOff()
		{
			cfimgs.forEach(cfimg =>
			{
				cfimg.style["opacity"] = "0";
			});
		}

		function cfimgOpacityOn()
		{
			cfimgs.forEach(cfimg =>
			{
				cfimg.style["opacity"] = "1";
			});
		}
	}
};

function makeCollapsableRows()
{
	var tables = document.querySelectorAll('section > table');
	tables.forEach(table =>
	{
		if(table.className.length == 0)
			table.className = 'normal';
		var rows = table.querySelectorAll('tr');
		for(var n = 0; n < rows.length; n++)
		{
			var hiddenCell = rows[n].querySelector('td:only-child');
			if(hiddenCell)
			{
				var linkCell = (n>0) ? rows[n-1].querySelector('td:first-child') : 0;
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
	var topSections = document.querySelectorAll('main > section');
	for(let topSection of topSections)
	{
		let sections = topSection.querySelectorAll('section');
		let expanded = topSection.querySelectorAll('section[expanded]');
		if(sections.length == expanded.length) continue;
		if(sections.length < 2) continue;
		sections.forEach(section =>
		{
			let h2 = section.querySelector('h2');
			if(h2)
			{
				if(!section.hasAttribute('expanded'))
				{
					h2.style['margin-bottom'] = '-20px';
					h2.insertAdjacentText('afterbegin', '[+] ');
					let siblings = section.querySelectorAll('h2 ~ *');
					siblings.forEach(sibling =>
					{
						sibling.setAttribute('hidden', '');
					});
				}
				else h2.insertAdjacentText('afterbegin', '[-] ');
				h2['className'] = 'linkified-heading';
				section.style.marginBottom = '10px';

				h2.addEventListener("click", event =>
				{
					let el = event.target;
					let c = el.textContent.charAt(1);

					if(c == '+') // expanding
					{
						el.parentElement.style.marginBottom = '0';
						el.style['margin-bottom'] = '';
						el.textContent = el.textContent.replace('+', '-');
						let siblings = section.querySelectorAll('h2 ~ *');
						siblings.forEach(sibling =>
						{
							sibling.removeAttribute('hidden');
						});
					}
					else // collapsing
					{
						el.parentElement.style.marginBottom = '10px';
						el.style['margin-bottom'] = '-20px';
						el.textContent = el.textContent.replace('-', '+');
						let siblings = section.querySelectorAll('h2 ~ *');
						siblings.forEach(sibling =>
						{
							sibling.setAttribute('hidden', '');
						});
					}
				}, false);
			}
		});
	};
}
window.onload = function()
{
	var toggler = document.getElementsByClassName("caret");
	var i;

	for (i = 0; i < toggler.length; i++)
	{
		toggler[i].addEventListener("click", function()
		{
			this.parentElement.querySelector(".nested").classList.toggle("active");
			this.classList.toggle("caret-down");
		});
	}

	var startDoc = 'widget_listbox.html';
	var loc = window.location.href;
	var pos = loc.indexOf('#');
	if(pos != -1)
	{
		startDoc = loc.substr(pos+1);
		if(startDoc.toLowerCase().indexOf('.html') == -1)
			startDoc += '.html';
	}

	var iframe = document.getElementsByTagName('iframe')[0];
	iframe.onload = makeSideBar;
	iframe.setAttribute('src', startDoc);
	
	window.onresize = function()
	{
		var fdoc = window.frames[0].window.document;
		var main = fdoc.getElementsByTagName('main')[0];
		var nav = fdoc.getElementsByTagName('nav')[0];

		if(typeof this.navHidden == 'undefined')
			this.navHidden = false;
		if(document.getElementById('frame').clientWidth < 1325)
		{
			if(!this.navHidden)
			{
				this.navHidden = true;
				nav.style.display = 'none';
				main.style.paddingRight = '0';
			}
		}
		else if(this.navHidden)
		{
			this.navHidden = false;
			nav.style.display = 'table';
			main.style.paddingRight = '300px';
		}
	};
	window.onresize();
};

function makeSideBar()
{
	var fdoc = window.frames[0].window.document;
	var rows = fdoc.querySelectorAll('tr.clickable-row');
	if(rows.length)
	{
		let main = fdoc.getElementsByTagName('main')[0];
		main.style.paddingRight = '300px';
		let nav = fdoc.createElement('nav');
		fdoc.body.appendChild(nav);
		let ul = fdoc.createElement('ul');
		nav.appendChild(ul);
		ul.id = 'nav-list';
		let items = new Array();
		for(let n=0; n<rows.length; n++)
		{
			let text = rows[n].querySelector('span').textContent;
			items.push(text);
			items[text] = n;
		}
		items.sort();
		for(let item of items)
		{
			let li = fdoc.createElement('li');
			ul.appendChild(li);
			let text = fdoc.createTextNode(item);
			li.appendChild(text);
			li.addEventListener('click', function()
			{
				let section = fdoc.querySelector('section[expanded]');
				if(section)
				{
					let el = section.querySelector('h2');				
					if(el.textContent.charAt(1) == '+') // expanding
					{
						el.style['margin-bottom'] = '';
						el.textContent = el.textContent.replace('+', '-');
						let siblings = section.querySelectorAll('h2 ~ *');
						siblings.forEach(sibling =>
						{
							sibling.removeAttribute('hidden');
						});
					}
				}

				let row = rows[items[this.textContent]];
				for(let r of rows)
				{
					let sib = r.nextElementSibling;
					if(!sib.hasAttribute('hidden'))
						sib.setAttribute('hidden', '');
				}
				let hiddenRow = row.nextElementSibling;
				if(hiddenRow.hasAttribute('hidden'))
					hiddenRow.removeAttribute('hidden');
				hiddenRow.scrollIntoView({/*behavior: 'smooth', */block: 'center'});
			});
		}
	}
}
onload = function()
{
	var toggler = document.getElementsByClassName('caret');
	var i;

	for (i = 0; i < toggler.length; i++)
	{
		toggler[i].addEventListener('click', function()
		{
			this.parentElement.querySelector(".nested").classList.toggle('active');
			this.classList.toggle('caret-down');
		});
	}

	onpopstate = onPopState;
	onPopState.skip = false;

	var TOCLinks = document.querySelectorAll('[data-href]');
	for(let link of TOCLinks)
	{
		link.onclick = function()
		{
			if(!link.classList.contains('selected'))
			{
				onPopState.skip = true;
				let href = this.getAttribute('data-href');
				frames[0].location.replace(href);
			}
		};
	}

	var startDoc = 'widget_listbox.html';
	fnTarget = new String();
	var loc = location.href;
	var pos = loc.indexOf('#');
	if(pos != -1)
	{
		let pos2 = loc.indexOf('::');
		if(pos2 != -1)
		{
			startDoc = loc.substring(pos+1, pos2);
			fnTarget = loc.substr(pos2+2);
		}
		else startDoc = loc.substring(pos+1);

		if(startDoc.toLowerCase().indexOf('.html') == -1)
			startDoc += '.html';
	}

	var iframe = document.getElementsByTagName('iframe')[0];
	iframe.onload = iframeOnLoad;
	iframe.setAttribute('src', startDoc);
	
	onresize = onResize;
	onResize();
};

function onResize()
{
	var fdoc = frames[0].document;
	var main = fdoc.getElementsByTagName('main')[0];
	var nav = fdoc.getElementsByTagName('nav')[0];

	if(typeof onResize.navHidden == 'undefined')
		onResize.navHidden = false;
	if(document.getElementById('frame').clientWidth < 1325)
	{
		if(!onResize.navHidden)
		{
			onResize.navHidden = true;
			nav.style.display = 'none';
			main.style.paddingRight = '0';
		}
	}
	else if(onResize.navHidden)
	{
		onResize.navHidden = false;
		nav.style.display = 'table';
		main.style.paddingRight = '300px';
	}
}

function onPopState()
{
	if(onPopState.skip)
	{
		onPopState.skip = false;
		return;
	}
	let frameDoc = frames[0].location.href;
	frameDoc = frameDoc.substring(frameDoc.lastIndexOf('/') + 1);
	let curDoc = location.hash.substring(1);
	let pos = curDoc.indexOf('::');
	if(pos != -1)
		curDoc = curDoc.substring(0, pos);
	if(frameDoc != curDoc) location.reload();
}

function iframeOnLoad()
{
	document.title = frames[0].document.title;
	setTOCCursor();
	makeSideBar();

	if(fnTarget !== 'undefined')
		scrollToFunction(fnTarget);

	if(typeof this.first === 'undefined')
	{
		this.first = false;
		return;
	}

	let href = frames[0].location.href;
	href = href.substring(href.lastIndexOf('/')+1);
	let loc = location.href;
	let pos = loc.indexOf('#');
	if(pos != -1)
		loc = loc.substring(0, pos);
	loc += '#' + href.substring(0, href.lastIndexOf('.html'));
	location.assign(loc);
}

function setTOCCursor(docName)
{
	var selected = document.querySelector('.selected');
	if(selected)
		selected.classList.toggle('selected');

	if(typeof docName === 'undefined')
	{
		var docName = frames[0].location.href;
		docName = docName.substring(docName.lastIndexOf('/') + 1);
	}

	var target = document.querySelector('[data-href="' + docName + '"]');
	if(target)
	{
		target.classList.toggle('selected');
		let ul = target.parentElement.parentElement;
		let span = ul.parentElement.firstElementChild;
		if(!span.classList.contains('caret-down'))
		{
			ul.classList.toggle('active');
			span.classList.toggle('caret-down');
		}
		ul = ul.parentElement.parentElement;
		span = ul.parentElement.firstElementChild;
		if(span.nodeName === 'SPAN' && !span.classList.contains('caret-down'))
		{
			ul.classList.toggle('active');
			span.classList.toggle('caret-down');
		}
	}
}

function makeSideBar()
{
	var fdoc = frames[0].document;
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
				if(section) expandSection(section);

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

function expandSection(section)
{
	var el = section.querySelector('h2');
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

function scrollToFunction(name)
{
	var fdoc = frames[0].document;
	var spans = fdoc.querySelectorAll('span.clickable-cell');
	
	for(let span of spans)
	{
		if(span.textContent === name)
		{
			let section = span.parentElement.parentElement.parentElement.parentElement.parentElement;
			expandSection(section);
			let hiddenRow = span.parentElement.parentElement.nextElementSibling;
			if(hiddenRow.hasAttribute('hidden'))
				hiddenRow.removeAttribute('hidden');
			hiddenRow.scrollIntoView({block: 'center'});
			return;
		}
	}
}
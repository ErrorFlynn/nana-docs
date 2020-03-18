onload = function()
{
	//alert(devicePixelRatio);
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
		link.onclick = onTOCLink;
		link.onauxclick = onTOCLink;
	}

	var startDoc = 'widget_intro.html';
	fnTarget = new String();
	secTarget = new Number(-1);
	var loc = location.href;
	var pos = loc.indexOf('#');
	if(pos != -1)
	{
		let pos2 = loc.indexOf('::');
		if(pos2 != -1)
		{
			startDoc = loc.substring(pos+1, pos2);
			let strTarget = loc.substr(pos2 + 2);
			if(isNaN(strTarget))
				fnTarget = strTarget;
			else secTarget = strTarget;
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

function onTOCLink(e)
{
	if(!this.classList.contains('selected'))
	{
		let href = this.getAttribute('data-href');
		if(e.which == 1) // left button
		{
			onPopState.skip = true;
			frames[0].location.replace(href);
		}
		else if(e.which == 2) // middle button
		{
			open('index.html#' + href, '_blank');
		}
	}
};

function onResize()
{
	var fdoc = frames[0].document;
	var main = fdoc.getElementsByTagName('main')[0];
	var nav = fdoc.getElementsByTagName('nav')[0];
	if(nav)
	{
		if(typeof onResize.navHidden == 'undefined')
			onResize.navHidden = false;
		if(document.getElementById('frame').clientWidth < remToPix(82.81)/*1325*/)
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
			nav.style.display = 'block';
			main.style.paddingRight = '256px';
		}
	
		nav.style.overflowY = "scroll";
		nav.style.top = '0';
		nav.style.transform = 'none';
		let sh = nav.scrollHeight;
		nav.style.overflowY = "auto";
		if(sh > nav.clientHeight)
		{
			nav.classList.add('scroll');
		}
		else
		{
			nav.classList.remove('scroll');
		}
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

	if(fnTarget.length)
		scrollToFunction(fnTarget);
	else if(secTarget >= 0)
		scrollToSection(secTarget);

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
	makeSideBar.hovered = false;
	var fdoc = frames[0].document;
	var main = fdoc.getElementsByTagName('main')[0];
	main.style.paddingRight = '256px';
	var sections = fdoc.querySelectorAll('main>section>section');
	var allRows = fdoc.querySelectorAll('tr.clickable-row');
	if(allRows.length)
	{
		let nav = fdoc.createElement('nav');
		fdoc.body.appendChild(nav);

		let ul = fdoc.createElement('ul');
		nav.appendChild(ul);
		ul.id = 'nav-list';

		for(let section of sections)
		{
			let rows = section.querySelectorAll('tr.clickable-row');
			if(sections.length > 1 && rows.length)
			{
				let head = fdoc.createElement('li');
				head.classList.toggle('head');
				let text = section.firstElementChild.textContent;
				text = text.replace(/\[-\]/g, '').replace(/\[\+\]/g, '');
				head.appendChild(fdoc.createTextNode(text));
				ul.appendChild(head);
			}
			let items = new Array();
			for(let n = 0; n < rows.length; n++)
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
					let row = rows[items[this.textContent]];
					let section = row.parentElement.parentElement.parentElement;
					if(section) expandSection(section);
					for(let r of allRows)
					{
						let sib = r.nextElementSibling;
						if(!sib.hasAttribute('hidden'))
							sib.setAttribute('hidden', '');
					}
					let hiddenRow = row.nextElementSibling;
					if(hiddenRow.hasAttribute('hidden'))
						hiddenRow.removeAttribute('hidden');
					hiddenRow.scrollIntoView({/*behavior: 'smooth', */block: 'center' });
				});
			}
			if(sections.length > 1 && sections[sections.length-1] != section)
			{
				if(section.querySelector('table.functions'))
				{
					let separator = fdoc.createElement('li');
					separator.classList.toggle('separator');
					//separator.appendChild(fdoc.createTextNode(''));
					ul.appendChild(separator);
				}
			}
		}
	}
	var headers = fdoc.querySelectorAll('ul#nav-list .head');
	if(headers.length == 1)
	{
		headers[0].style.display = 'none';
		let separators = fdoc.querySelectorAll('ul#nav-list .separator');
		separators[0].style.display = 'none';
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
	if(name.length)
	{
		let fdoc = frames[0].document;
		let spans = fdoc.querySelectorAll('span.clickable-cell');
	
		for(let span of spans)
		{
			if(span.textContent == name || (span.textContent.indexOf(name) == 0 && span.textContent.indexOf('/') != -1))
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
}

function scrollToSection(idx)
{
	if(idx >= 0)
	{
		let fdoc = frames[0].document;
		let sections = fdoc.querySelectorAll('section>section');
		if(sections.length > idx)
		{
			expandSection(sections[idx]);
			sections[idx].scrollIntoView();
		}
	}
}

function remToPix(rem)
{
	return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}
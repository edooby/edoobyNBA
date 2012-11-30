// Safari global vars
var _cb=null;
var _dialogArguments=null;
var _extraArgs=null;

function Util()
{
	// Determine if IE is the browser
	this.isie = (window.navigator.userAgent.indexOf("MSIE")>0);
	this.issafari = (window.navigator.userAgent.indexOf("Safari")>0);
	this.ismac = (window.navigator.userAgent.indexOf("Mac")>0);

	// Trims whitespace from beginning and end of string
	this.trim = function(s)
	{
	    if (s==null)
		   return "";
    
	    return s.replace(/(^\s+)|(\s+$)/g, "");
	}

	this.getEvtSrc=function(event)
	{
		if (this.isie)
		   return event.srcElement;
		else
		   return event.target;
	}

	// Returns the top left absolute coordinates of the event source element
	this.getMouseXY=function(event,obj)
	{
		var x,y;
		if (this.isie)
		{
			if (!obj)
			{ x = document.body.scrollLeft + event.clientX - event.offsetX;
			  y = document.body.scrollTop + event.clientY - event.offsetY;
			}
			else  // Non-absolute position
			{
			  x = obj.getBoundingClientRect().left + document.body.scrollLeft;
			  y = obj.getBoundingClientRect().top + document.body.scrollTop;
			}

		}
		else
		{
			var x = 0;
			var y = 0;
			var temp = null;

			if (!obj)
			   temp=(event==null)?obj:this.getEvtSrc(event);
			else
			   temp=obj;   // Object is passed in
	           
			do
			{
				x += temp.offsetLeft;
				y += temp.offsetTop;
				temp = temp.offsetParent;
			}
			while(temp!=null)
		}
		return new Array(x,y);
	}
	
	this.getMouseXY_Static = function(obj, strRootId)
	{
		var x = 0;
		var y = 0;
		var temp=obj;
		do
		{
			x += temp.offsetLeft;
			y += temp.offsetTop;
			temp = temp.offsetParent;
		}
		while(temp!=null && temp.id!=strRootId)
		
		return new Array(x,y);
	}
	
	// Cancels the browser event for all browswers
	this.cancelEvt=function(event)
	{
		if (event==null)
		{
			// alert("ERROR:  EVENT OBJECT IS NULL WHEN TRYING TO CANCEL EVENT.");
			return;
		}

		if (this.isie)
		{
			event.cancelBubble=true;
			event.returnValue=false;
		}
		else
		{
			event.stopPropagation();
			event.preventDefault();
		}

		return false;
	}
	
	// This function will return the index of the item in the given array or -1 if not found
	this.getArrayIndex=function(oArray, oItem)
	{
		for (var i=0; i<oArray.length; i++)
		{
			if (oArray[i]==oItem)
				return i;
		}
    
		return -1;
	}

	// This function will check for a value inside the given array
	// Returns true if the item is in the array specified or false if not found in the array
	this.inArray=function(oArray, oItem)
	{
		if (this.getArrayIndex(oArray, oItem) >= 0)
			return true;

		return false;
	}

	// This function will show a modal window for ie/netscape, then call the specified callback function
	this.showModal=function(url, args, extraArgs, fnCallback, iWidth, iHeight, windowParams, navigable)
	{
	    var ieWindowParams="center:yes;help:no;resizable:yes;status:no;";
	    var nsWindowParams="directories=no,toolbar=no,menubar=no,location=not,alwaysRaised=yes,dependent=yes,resizable=yes,status=no,";
	
	    if (windowParams != null)
	    {
	        windowParams="help:no;"+windowParams;
	        ieWindowParams=windowParams;
	        nsWindowParams=windowParams.replace(/:/g,"=").replace(/;/g,",");
	    }
	
	    if (iWidth!=null && iWidth!="" && iHeight!=null && iHeight!="")
	    { var dlgLeft = (screen.width-iWidth)/2;
	      var dlgTop  = (screen.height-iHeight)/2;
	    
	      ieWindowParams+="dialogWidth:"+iWidth+"px;dialogHeight:"+iHeight+"px;";
	      nsWindowParams+="left="+dlgLeft+"px,top="+dlgTop+"px,width="+iWidth+"px,height="+iHeight+"px;";
	    }
	
	    if (this.isie)
	    {
	        if (window.event && window.event.ctrlKey && window.bMainPage!=true && window.bRepeaterPage!=true)
	        { var strMsg="Navigating to the following URL:\n\n"+url+"\n\nPress Ctrl+C to copy to the windows clipboard.";
	          alert(strMsg);
	        }
	
	        var ret = null;
	        if (navigable!=null && navigable==true)
	        {
	        	args[args.length] = url;
	            ret = window.showModalDialog("iemodal.htm",args,ieWindowParams);
	        }
	        else
	           ret = window.showModalDialog(url,args,ieWindowParams);
	        
	        if (ret!=null && fnCallback)
	           fnCallback(ret,extraArgs);
	    }
	    else
	    {
	        var win = null;
	        if(navigable!=null && navigable==true)
	        {
			    args[args.length]=url;
	            url="iemodal.htm";			
	        }
	
	        win = window.open(url,"MODAL"+iHeight, nsWindowParams);
	        
	        if (win==null)
	        {
	            alert("Error:  Popup windows are disabled in the browser; please enable popups in order to continue.");
	            return;
	        }
	           
	        if (fnCallback)
	            win.cb=fnCallback;
	        win.dialogArguments=args;

			if (this.issafari)
			{
				_cb=fnCallback;	        
		        _dialogArguments=args;
				_extraArgs=extraArgs;
			}

	        win.extraArgs=extraArgs;
	        win.focus();
	    }
	}

	this.getInnerText = function(node)
		{
		    if (node==null)
		       return "";
		
		    var innerT = "";
		    if(node.hasChildNodes())
		    {
		        for(var i=0;i<node.childNodes.length;i++)
		        {
		            if(node.childNodes[i].tagName!="SCRIPT")
		                innerT += util_getInnerText(node.childNodes[i]);
		        }
		    }
		    else
		    {
		        innerT = node.nodeValue;
		    }
		
		    if (innerT==null)
		       innerT="";
		
		    return innerT;
		}

	this.setInnerText = function (node, text)
		{
		    if ((node==null) || (text==null))
		       return;
		
		    node.innerHTML = "";
		    node.appendChild(document.createTextNode(text));
		}

	this.selectNodes=function(currnode,xpath,bNoArray)
		{
			if(!currnode)
				return null;
		
			if(this.isie)
			{
				try
				{	
					return currnode.selectNodes(xpath);
				}
				catch (e)
				{
					return new Array();
				}
			}
			else if(this.issafari)
			{
				var tags = xpath.split("/");
				if(tags[0].length==0 && tags[1]!=currnode.tagName)
					return null;
				var s = (tags[0].length==0)?2:1;

				var xPathResult = recurseSingleNodeFind(currnode, tags, s, false).parentNode;

				if (bNoArray==true)
				   return xPathResult;
				var aNodeArray = new Array();
				if (xPathResult)
				{
					for (var i=0; i<xPathResult.childNodes.length; i++)
					{	if (xPathResult.childNodes[i].nodeType==1 && xPathResult.childNodes[i].tagName==tags[tags.length-1])
							aNodeArray[aNodeArray.length] = xPathResult.childNodes[i];
					}
				} 
				return aNodeArray;
			}
			else
			{
				var xPathResult = null;
				if(currnode.ownerDocument==null)
					xPathResult=currnode.evaluate(xpath, currnode, null, 0, null);
				else
					xPathResult=currnode.ownerDocument.evaluate(xpath, currnode, null, 0, null);
				
				if (bNoArray==true)
				   return xPathResult;
				
				var aNodeArray = new Array();
				if (xPathResult)
				{
					var oNode = null;
					while((oNode=xPathResult.iterateNext()))
					{
						aNodeArray[aNodeArray.length] = oNode;
					}
				} 
				return aNodeArray;
			}
		}
	this.selectSingleNode = function(currnode,xpath)
		{
			if(!currnode)
				return null;
		
			if(this.isie)
			{
				return currnode.selectSingleNode(xpath);
			}
			else if(this.issafari)
			{
				var tags = xpath.split("/");
				if(tags[0].length==0 && tags[1]!=currnode.tagName)
					return null;
				var s = (tags[0].length==0)?2:1;
				return recurseSingleNodeFind(currnode, tags, s, false);
			}
			else   // isnetscape
			{
				if(currnode.ownerDocument==null)
					return currnode.evaluate(xpath,currnode,null,0,null).iterateNext();
				else
					return currnode.ownerDocument.evaluate(xpath,currnode,null,0,null).iterateNext();
			}
		}

	this.selectSingleNodeText = function(currnode,xpath,bRelative)
		{
			if(!currnode)
				return null;

			if (typeof(currnode)=="string")
			   return currnode;
			   		
			if(this.isie)
			{
				var node = currnode.selectSingleNode(xpath);
				if(node!=null)
					return node.text;
				else
					return null;
			}
			else if(this.issafari)
			{
				var tags = xpath.split("/");
				if(tags[0].length==0 && tags[1]!=currnode.tagName)
					return null;
				var s = (tags[0].length==0)?2:1;
				
				if (bRelative==true)  // Workaround for Safari
					s=0;
					
				return recurseSingleNodeFind(currnode, tags, s, true);
			}
			else   // isnetscape
			{
				var node = null;
				if(currnode.ownerDocument==null)
					node=currnode.evaluate(xpath,currnode,null,0,null).iterateNext();
				else
					node=currnode.ownerDocument.evaluate(xpath,currnode,null,0,null).iterateNext();
		
				if(node!=null)
				{
					if(node.firstChild!=null)
						return node.firstChild.nodeValue;
					else
						return "";
				}
				else
					return null;
			}
		}

	this.setFocusToCtrl = function(strCtrl)
		{
			try
			{ 
				document.getElementById(strCtrl).focus(); 
				document.getElementById(strCtrl).select(); 
			}
			catch (e) {}
		}

	// Returns the URL query string parameters as a hashtable
	this.getURLParams = function()
	{
		if(window.location.search.length>1)
		{
			var nvs = window.location.search.substring(1).split("&");
			if(nvs.length>0)
			{
				var ret = new Object();
				for(var i=0;i<nvs.length;i++)
				{
					var nv = nvs[i].split("=");
					if(nv.length==2)
						ret[nv[0]] = nv[1];
					else
						ret[nv[0]] = "";
				}
				return ret;
			}
			else
				return null;
		}
		else
			return null;
	}

	this.addOption = function(lb,strValue,strLabel,index)
		{
		    var oOption = document.createElement("OPTION");
			lb.options.add(oOption, index);
					    
		    if (strLabel==null)
		       strLabel=strValue;

		    oOption.text=strLabel;
		    oOption.value=strValue;
		    
		    return oOption;
		}

	// This function will set a value of a listbox to strValue.  It will guarantee
	// the value of the listbox will be set properly with an existing value
	this.setListBoxValue = function(lbList,strVal)
		{
		    if (lbList==null)
		       return;
		       
		    for (var i=0; i<lbList.options.length; i++)
		    {
		        if (lbList.options[i].value==String(strVal))
		        { lbList.options[i].selected=true;
		          // lbList.selectedIndex=i;
		          return i;
		        }
		    }
		    
		    return -1;
		}

	this.advanceField = function(event,currentField,strNextFieldName,iMaxLen)
		{
			if ((event.keyCode>=48 && event.keyCode<=57) ||  // Number
			    (event.keyCode>=65 && event.keyCode<=122))   // Alpha
			{
				if (currentField.value.length == iMaxLen)
				{
					document.getElementById(strNextFieldName).focus();
					document.getElementById(strNextFieldName).select();
				}
			}
		}

	this.getCurrentStyle = function(obj,attribute)
		{
		    if (typeof(obj) == 'string') 
		    	obj = document.getElementById(obj);
			
			if (obj.style[attribute])
			{	// inline style property
				return obj.style[attribute];
			} else if (obj.currentStyle)
			{	// external stylesheet for Explorer
				return obj.currentStyle[attribute];
			}
			else if (document.defaultView && document.defaultView.getComputedStyle)
			{	// external stylesheet for Mozilla and Safari 1.3+
				attribute = attribute.replace(/([A-Z])/g, "-$1");
				attribute = attribute.toLowerCase();
				var ret=document.defaultView.getComputedStyle(obj,"");
				if (ret!=null)
					return ret.getPropertyValue(attribute);
			}

			return null;
		}

	this.removeNode = function(obj)
		{
		    return obj.parentNode.removeChild(obj);
		}

	this.removeTableRows = function(tbl, bSaveHeaderRow)
		{
			var iStartRow=0;
			if (bSaveHeaderRow==true)
				iStartRow=1;
				
			if (tbl!=null)
			{
				while (tbl.rows.length > iStartRow)
					_util.removeNode(tbl.rows[iStartRow]);
			}
		}

	this.isDemoUser = function(xml)
		{
			var demoUser=false;

			try
			{
				var result = _util.selectSingleNodeText(xml, "/result/code");
				if (result!=null && result=="nodemoaccess")
				{
					alert(getLocalizedString("demo_user_no_access"));
					demoUser=true;
				}
			}
			catch (e)
			{
				// alert("isDemoUser():  Invalid returned xml value: '"+xml+"'");
			}
			
			return demoUser;
		}

}
		
function recurseSingleNodeFind(node, tags, x, getText)
{
	for(var i=0;i<node.childNodes.length;i++)
	{
		if(node.childNodes[i].nodeType==1)
		{
			if(node.childNodes[i].tagName==tags[x])
			{
				if(x==tags.length-1)
				{
					if(getText)
					{
						if(node.childNodes[i].firstChild!=null)
						{
							return node.childNodes[i].firstChild.nodeValue;
						}
						else
						{
							return "";
						}
					}
					else
						return node.childNodes[i];
				}
				else
					return recurseSingleNodeFind(node.childNodes[i], tags, x+1, getText);
			}
		}
	}
}

function getLocalizedString(key)
{
	var obj = document.getElementById("msg_"+key);
	if(obj!=null)
		return obj.innerHTML.replace(/\\n/g,"\n");
	alert("Error - Localization key '"+key+"' not found.");
}

function invokeSyncCall(pfx, url, data, callback)
{
	if(pfx==null)
		pfx = "";
	var requester=null;
	if(_util.isie)
		requester = new ActiveXObject("Microsoft.XMLHTTP");
	else
		requester = new XMLHttpRequest();
				
	requester.open("POST", pfx+url, false);
	requester.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	
	requester.send(data);
			
	var iStatus=requester.status;
	if (iStatus>=200 && iStatus<300)
	{
		// Success
		if(requester.getResponseHeader("Content-Type").indexOf("text/xml")==0 || requester.getResponseHeader("Content-Type").indexOf("application/xml")==0)
		{
			callback(requester.responseXML.documentElement);
		}
		else
			callback(requester.responseText);
	}
}
function invokeSyncCallbackChangeLocale(xml)
{
	var result = "";	
	try
	{
		result = _util.selectSingleNodeText(xml, "/result/data/refresh");
		if (result!=null && result.length>0)
		{
			location.href = location.href
		}
	}
	catch (e)
	{
	}
}
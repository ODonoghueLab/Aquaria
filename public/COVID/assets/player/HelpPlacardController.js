var HelpPlacardController = Class.create({
  initialize: function (b) {
    this.domNode = b;
    this.width = 822;
    this.height = 603;
    var a = [{
      key: "&nbsp;",
      text: kHelpPlacardNavigationTitle,
      header: true
    }, {
      key: "return/enter &nbsp; space &nbsp; &#8594 &nbsp; &#8595 &nbsp; page down",
      text: kHelpPlacardAdvanceToNextBuild
    }, {
      key: "[ &nbsp; shift - page up &nbsp; shift - &#8592",
      text: kHelpPlacardGoBackToPreviousBuild
    }, {
      key: "] &nbsp; shift - &#8594",
      text: kHelpPlacardAdvanceAndSkipBuild
    }, {
      key: "shift - page down &nbsp; shift - &#8595 &nbsp; + &nbsp; =",
      text: kHelpPlacardAdvanceToNextSlide
    }, {
      key: "&#8592 &nbsp; &#8593 &nbsp; - &nbsp; shift - &#8593",
      text: kHelpPlacardGoBackToPreviousSlide
    }, {
      key: "home",
      text: kHelpPlacardGoToFirstSlide
    }, {
      key: "end",
      text: kHelpPlacardGoToLastSlide
    }, {
      key: "slide number + return/enter",
      text: kHelpPlacardGoToSpecificSlide
    }, {
      key: "&nbsp;",
      text: kHelpPlacardOtherTitle,
      header: true
    }, {
      key: "? &nbsp; /",
      text: kHelpPlacardShowOrHideKeyboardShortcuts
    }, {
      key: "s",
      text: kHelpPlacardShowOrHideTheCurrentSlideNumber
    }, {
      key: "esc &nbsp; q",
      text: kHelpPlacardQuitPresentationMode
    }];
    this.helpPlacardTitleBar = new HelpPlacardTitleBar();
    this.helpPlacardContentPanel = new HelpPlacardContentPanel(a);
    this.helpPlacardFooter = new HelpPlacardFooter();
    this.domNode.appendChild(this.helpPlacardTitleBar.domNode);
    this.domNode.appendChild(this.helpPlacardContentPanel.domNode);
    this.domNode.appendChild(this.helpPlacardFooter.domNode);
    this.isShowing = false
  },
  handleClickEvent: function (a) {
    a = a || window.event;
    var b = a.target || a.srcElement;
    if (this.isShowing) {
      if (browserPrefix === "ms") {
        a.cancelBubble = true
      } else {
        a.stopPropagation()
      }
    }
    this.hide()
  },
  setPosition: function (b, a) {
    this.domNode.style.left = b + "px";
    this.domNode.style.top = a + "px"
  },
  show: function () {
    this.isShowing = true;
    this.domNode.style.display = "block";
    this.domNode.style.opacity = 1
  },
  hide: function () {
    this.isShowing = false;
    this.domNode.style.display = "none";
    this.domNode.style.opacity = 0
  },
  registerDragEvents: function () {
    this.drag = this.dragging.bindAsEventListener(this);
    this.dragStop = this.stopDragging.bindAsEventListener(this);
    Event.observe(this.domNode, "mousedown", this.startDragging.bindAsEventListener(this))
  },
  startDragging: function (a) {
    this.startX = Event.pointerX(a);
    this.startY = Event.pointerY(a);
    this.left = parseInt(this.domNode.style.left);
    this.top = parseInt(this.domNode.style.top);
    Event.observe(document, "mousemove", this.drag);
    Event.observe(this.domNode, "mouseup", this.dragStop)
  },
  dragging: function (b) {
    var a = Event.pointerX(b);
    var c = Event.pointerY(b);
    this.domNode.style.left = (a - this.startX + this.left) + "px";
    this.domNode.style.top = (c - this.startY + this.top) + "px";
    Event.stop(b)
  },
  stopDragging: function (a) {
    Event.stopObserving(document, "mousemove", this.drag);
    Event.stopObserving(this.domNode, "mouseup", this.dragStop);
    Event.stop(a)
  }
});
var HelpPlacardTitleBar = Class.create({
  initialize: function () {
    this.domNode = document.createElement("div");
    this.domNode.setAttribute("class", "helpPlacardTitleBar");
    this.closeButton = document.createElement("div");
    this.closeButton.setAttribute("class", "helpPlacardCloseButton");
    this.title = document.createElement("div");
    this.title.setAttribute("class", "helpPlacardTitle");
    this.title.innerHTML = kHelpPlacardMainTitle;
    this.domNode.appendChild(this.closeButton);
    this.domNode.appendChild(this.title)
  }
});
var HelpPlacardContentPanel = Class.create({
  initialize: function (a) {
    this.domNode = document.createElement("div");
    this.domNode.setAttribute("class", "helpPlacardContentPanel");
    for (var c = 0, f = a.length; c < f; c++) {
      var e = a[c];
      var g = document.createElement("div");
      var b, d;
      if (e.header) {
        g.setAttribute("class", "helpPlacardHeader");
        b = document.createElement("div");
        b.setAttribute("class", "helpPlacardLeftHeaderItem");
        b.innerHTML = e.text;
        g.appendChild(b)
      } else {
        g.setAttribute("class", "helpPlacardItem");
        b = document.createElement("div");
        b.setAttribute("class", "helpPlacardRightItem");
        b.innerHTML = e.key;
        d = document.createElement("div");
        d.setAttribute("class", "helpPlacardLeftItem");
        d.innerHTML = e.text;
        g.appendChild(b);
        g.appendChild(d)
      }
      this.domNode.appendChild(g)
    }
  }
});
var HelpPlacardFooter = Class.create({
  initialize: function () {
    this.domNode = document.createElement("div");
    this.domNode.setAttribute("class", "helpPlacardFooter");
    var a = document.createElement("div");
    a.innerHTML = "Acknowledgements";
    a.setAttribute("class", "helpPlacardAcknowledgementsButton");
    Event.observe(a, "click", this.handleClickEvent.bind(this));
    this.domNode.appendChild(a)
  },
  handleClickEvent: function (a) {
    a = a || window.event;
    if (browserPrefix === "ms") {
      a.cancelBubble = true
    } else {
      a.stopPropagation()
    }
    window.open("Acknowledgements.pdf", "_Acknowledgements")
  }
});

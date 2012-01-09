function HideAndShow(opts) {
	var self = this;
	
	this.div = null;
	this.sections = [];
	this.current = {};
	this.step = 3000;
	if (opts['step']) {
		this.step = opts['step'];
	}
	if (opts['div']) {
		this.div = this.$(opts['div']);
		this.sections = $$('#' + this.div.identify() + ' .section');
	}
	if (opts['sections']) {
		this.sections = opts['sections'];
	}
	
	this.hider = Effect.Fade;
	this.shower = Effect.Appear;
	this.showOptions = {};
	this.hideOptions = {};
	
	if (opts['shower']) {
		this.shower = opts['shower'];
	}
	
	if (opts['showOptions']) {
		this.showOptions = opts['showOptions'];
	}
	
	if (opts['hider']) {
		this.hider = opts['hider'];
	}
	
	if (opts['hideOptions']) {
		this.hideOptions = opts['hideOptions'];
	}
	
	this.hideOptions['sync'] = true;
	this.showOptions['sync'] = true;
	$$('.section-img-controls-number a').each(function(s){
    $(s).observe('click', function(event){
			self.stop(); 
			if (self.$(self.current) != self.$(s)) {
				self.show(self.$('section' + s.getAttribute("data-number"))); 
			}
			return false;      
    });
	});
	
	$$('.section-img-buttons a').each(function(s){
    $(s).observe('click', function(event){
        self.stop();
        if ('previous' == s.getAttribute("data-control")) {
          self.previous(); 
        }
        
        if ('next' == s.getAttribute("data-control")) {
          self.next(); 
        }
        return false;
    
    }
	});
	
	this.show = function(elem) {
		if (self.inSections(elem)) {
			if (self.current != elem) {
				new Effect.Parallel([
					self.hider(self.current, self.hideOptions),
					self.shower(elem, self.showOptions)
				]);
				self.current = elem;
				return elem;
			}
		}
		return false;
	}
	
	this.inSections = function(elem) {
		elem = self.$(elem);
		return self.sections.any(function(s) {
			return s.id == elem.id;
		});
	}
	
	this.getIndex = function(elem) {
		var i = -1;
		self.sections.each(function(s, j){
			if (s.identify() == elem.identify()) {
				i = j;
			}
		});
		return i;
	}
	
	this.hideAll = function() {
		self.sections.each(function(s) {
			s.hide();
		});
	}
	
	this.next = function() {
		var max = self.sections.size();
		var next = self.getIndex(self.current) + 1;
		if (next >= max) {
			next = 0;
		}
		return self.show(self.sections[next]);
	}
	
	this.previous = function() {
		var max = self.sections.size();
		var next = self.getIndex(self.current) - 1;
		if (next < 0) {
			next = max - 1;
		}
		return self.show(self.sections[next]);
	}
	
	this.start = function() {
		if(self.div && self.sections.size() > 0) {
			self.current = self.sections[0];
			self.timer(function(){self.next()}, self.step)
			return self.current;
		}
	}
	
	this.stop = function() {
		if(self.timerId) {
			clearInterval(self.timerId);
			self.timerId = null;
		}
	}
	
	this.timer = function(fn, time) {
		self.stop();
		self.timerId = setInterval(fn, time);
	}
	
	this.$ = function(o) {
		return document.getElementById(o);
	}
}

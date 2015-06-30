(function(scope) {

	function Request(options) {
		
		options = options || {};

		this.url = options.url;
		this.method = options.method || this.GET;
		this.body = options.body;
		this.reqHeaders = options.reqHeaders;
		this.withCredentials = options.withCredentials;
		this.timeout = options.timeout;
		this.username = options.username;
		this.password = options.password;
		this.progress = options.progress;
		this.xhr = new XMLHttpRequest();
		this.promise = pinkySwear();
	}

	Request.prototype = {
		
		get GET()  { return "GET"; },
		get POST() { return "POST"; },
		get PUT() { return "PUT"; },
		get DELETE() { return "DELETE"; },

		exec: function() {
			if (!this.method || !this.url) {
				this.promise(false, [this, this.promise, "url and method are required!!"]);
				return this.promise;
			}

			this.xhr.open(this.method, this.url, true, this.username, this.password);

			this.xhr.timeout = this.timeout || 10000;
			this.xhr.withCredentials = this.withCredentials;
			this.xhr.onreadystatechange = this.readyStateChange.bind(this);
			this.xhr.addEventListener("abort", this.handleAbort.bind(this));
			this.xhr.addEventListener("progress", this.handleProgress.bind(this));

			if (this.contentType) {
				this.xhr.setRequestHeader("content-type", this.contentType);
			}

			if (this.reqHeaders) {
				this.reqHeaders.forEach(function(header) {
					this.xhr.setRequestHeader(header.name, header.value);
				}.bind(this));
			}

			this.xhr.send(data);

			return this.promise;
		},

		readyStateChange: function() {
			var result = {};
			if (this.xhr.readyState === 4) {
				this.fire("data-result");
				this.response = this.responseHandler[this.responseType || 'json'].call(this);
				if (!this.xhr.status || (this.xhr.status >= 200 && this.xhr.status < 300)) {
					result = {response: this.response, instance: this};
					if (this.promise) {
						this.promise(true, [this, this.promise, result]);
					}
				} else {
					result = {error: this.xhr.status, instance: this, response: this.response};
					if (this.promise) {
						this.promise(false, [this, this.promise, result]);
					}
				}
			}
		},

		handleAbort: function() {
			if (this.promise) {
				this.promise(false, [this, this.promise, 'aborted']);
			}
		},

		handleProgress: function(e) {
			if (this.progress) {
				this.progress({
					percent: e.totalSize/e.position,
					total: e.totalSize,
					current: e.position
				});
			}
		},

		responseHandler: {

			xml: function() {
				return this.xhr.responseXML;
			},

			text: function() {
			return this.xhr.responseText;
			},

			json: function() {
				var response = this.xhr.responseText;
				try {
					return JSON.parse(response);
				} catch (e) {
					this.fire("data-error", {error: e.message, instance: this});
					return response;
				}
			},

			document: function() {
				return this.xhr.response;
			},

			blob: function() {
				return this.xhr.response;
			},

			arrayBuffer: function() {
				return this.xhr.response;
			},

		},

		abort: function() {
			if (this.xhr) {
				this.xhr.abort();
			}
		},

		get status() {
			return this.xhr && this.xhr.status;
		},

		get state() {
			return this.xhr && this.xhr.readyState;
		},
	};

	scope.Request = Request;
}(window.StrandLib = window.StrandLib || {}));
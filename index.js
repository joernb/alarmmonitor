angular.module("app", [])
	.factory("Timer", function($interval, $timeout) {
		return function(repeat) {
			this.promise = null;
			this.start = function(interval, callback) {
				this.stop();
				this.promise = repeat ? $interval(callback, interval) : $timeout(callback, interval);
			};
			this.stop = function() {
				if (this.promise) {
					if (repeat) {
						$interval.cancel(this.promise);
					} else {
						$timeout.cancel(this.promise);
					}
				}
			};
		};
	})
    .value("config", {})
	.factory("standbyTimer", function(Timer) {
		return new Timer(false);
	})
	.factory("activateStatusDisplay", function($log, $http, config, $rootScope, executeShellCommand, standbyTimer, activateStandby) {
		return function() {
			$log.info("Activating status display");
            $rootScope.displayIframe = true;

			// delay standby
			standbyTimer.start(config.standbyDelayInSeconds * 10000, activateStandby);

			executeShellCommand(config.activateStatusDisplayShellCommand);
		};
	})
	.factory("activateStandby", function($log, $rootScope, config, executeShellCommand, standbyTimer) {
		return function() {
            $log.info("Activating standby");
			standbyTimer.stop();
            $rootScope.displayIframe = false;
			executeShellCommand(config.activateStandbyShellCommand);
		};
	})
    .factory("button1", function(activateStatusDisplay) {
        return activateStatusDisplay;
    })
    .factory("button2", function(activateStandby) {
        return activateStandby;
    })
	.factory("executeShellCommand", function($q) {
		return function(command, outputCallback) {
			return new $q(function(resolve, reject) {
				if (command && command !== "") {
					// open web socket and send command to websocketd process
					var socket = new WebSocket("ws://localhost:8080");
					socket.onopen = function() {
						socket.send(command);
					};
					socket.onmessage = function(event) {
						outputCallback(event.data);
					};
					socket.onclose = resolve;
					socket.onerror = reject;
				} else {
					reject();
				}
			});
		};
	})
	.run(function($injector, $rootScope, $http, $log, $sce, config, activateStatusDisplay, executeShellCommand) {
        $log.info("Startup");

        // load json config and make it injectable
        $http.get("config.json").then(function(response) {

        	// store config
            $log.info("Configuration loaded: ");
            $log.info(response.data);
            Object.assign(config, response.data);

            // make accessible on $rootScope
			$rootScope.iframeUrl = $sce.trustAsResourceUrl(config.iframeUrl);

            // execute scripting shell command to receive scripting commands
            $log.info("Executing script shell command: " + config.scriptShellCommand);
            executeShellCommand(config.scriptShellCommand, function(command) {
                $log.info("Executing command: " + command);
                try {
                	// inject and execute the command (the command should be defined as a factory)
                    $injector.get(command)();
                    // apply scope changes
                    $rootScope.$apply();
                } catch (e) {
                    $log.error("Could not execute received command: " + command);
                    $log.error(e);
                }
            }).then(function() {
                $log.error("Error during execution of scriptShellCommand: " + config.scriptShellCommand);
            });

            // initial display activation
            activateStatusDisplay();

        }, function() {
            $log.error("Could not load config.json");
		});
	});
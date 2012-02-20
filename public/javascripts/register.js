function checkLocation(address, callback) {
    var isValid, scope = this,
        googleMap = this.rule.googleMap;

    googleMap.geocoder.geocode({'address': address}, function(results, status) {
        isValid = status == google.maps.GeocoderStatus.OK;
        if (isValid) {
            address = results[0];
            googleMap.centerMap(address.geometry.location);
            googleMap.addMapMarker(address.geometry.location);
            scope.address = address.geometry.location;
        }
        callback.call(scope, isValid, address);
    });
}

function checkLoginAvailability(login, callback) {
    var scope = this;

    $.post('/utils/checkLoginAvailability', {login: login}, function(response) {
        scope.errorText = 'Login already in use';
        callback.call(scope, response.success);
    }, 'json');
}

function checkEmailAvailability(email, callback) {
    var scope = this;

    $.post('/utils/checkEmailAvailability', {email: email}, function(response) {
        scope.errorText = 'Email already in use';
        callback.call(scope, response.success);
    }, 'json');
}

$(function() {


    // FORM

    $.extend($.fn, {

        validator: function(config) {
            this.each(function() {
                var timeout = false,
                    $form = $(this),
                    $elements = $('input, select', $form),
                    $button = $('button.btn-primary', $form);

                $.extend($form, config);

                $elements.on('focus', function() {
                    var $input = $(this);
                    this.oldValue = $input.val();
                });

                $elements.on('blur', function() {
                    var $input = $(this),
                        value = $input.val();

                    if (value !== this.oldValue) {
                        $input.validate($form.rules);
                    }
                });

                $elements.on('keyup', function() {
                    var $input = $(this),
                        value = $input.val();

                    if (timeout) {
                        clearTimeout(timeout);
                        timeout = false;
                    }

                    if (value !== this.oldValue) {
                        timeout = setTimeout(function() {
                            $input.validate($form.rules);
                        }, 1000);
                    }
                });

                $button.on('click', function() {
                    var values = {},
                        l = $elements.length,
                        errors = 0, count = 0;

                    if ($button.hasClass('disabled')) return;

                    $button.addClass('disabled');

                    $elements.validate($form.rules, function(element, success) {
                        count++;
                        name = element.attr('name');
                        if (success === true) {
                            if (element.address) {
                                values[name] = element.address.lat()+'|'+element.address.lng();
                            } else {
                                values[name] = element.val();
                            }
                        } else errors++;
                        if (l === count) {
                            if (errors) {
                                $button.removeClass('disabled');
                            } else {
                                $form.submitValues(values);
                            }
                        }
                        
                    }, $form);

                });

            });
        },

        submitValues: function(values) {
            console.log('submitValues', values);
            var scope = this,
                $button = $('button.btn-primary', scope);

            scope.setLoading(true);
            $.post('/utils/createUser', values, function(response) {
                console.log('submit callback', response);
                scope.setLoading(false);
                $button.removeClass('disabled');
                if (response.success) {
                    document.location.href = '/home';
                }
            }, 'json');
        },

        setLoading: function(visible) {
            var $loader = $('.form-loader', this);
            if (visible) {
                $loader.css('display', 'inline-block')
            } else $loader.hide();
        },

    });


    // VALIDATOR

    $.extend($.fn, {

        validate: function(rules, callback, scope) {
            this.each(function() {
                var isValid = false,
                    $element = $(this),
                    name = $element.attr('name'),
                    rule = rules[name] || {},
                    validator = $element[rule.type+'Validation'];

                $.extend($element, {
                    rule: rule,
                    errorCls: 'error',
                    validCls: 'success',
                    warningCls: 'warning',
                    errorText: 'This field is required',
                    group: $element.parents('.control-group'),
                    elementValue: $element.is('select') ? $('option:selected', $element).val() : $element.val(),
                });

                isValid = rule.required ? $element.defaultValidation() : true;
                if (isValid && validator) {
                    isValid = validator.call($element);
                }

                if (isValid && rule.match) {
                    isValid = $element.matchValidation();
                }

                if (isValid && rule.remote) {
                    $element.remoteValidation(function(isValid) {
                        console.log('validate', $element.attr('name'), isValid);
                        $element.setValidationState(isValid);
                        (callback || function() {}).call(scope, $element, isValid);
                    });
                } else {
                    console.log('validate', $element.attr('name'), isValid);
                    $element.setValidationState(isValid);
                    (callback || function() {}).call(scope, $element, isValid);
                }

            });
        },

        remoteValidation: function(callback) {
            var loader = $('.input-loader', this.parent());
            loader.css('display', 'inline-block');
            this.rule.remote.call(this, this.elementValue, function(success) {
                if (!success) {
                    success = -1;
                }
                loader.hide();
                callback.call(this, success);
            });
        },

        defaultValidation: function() {
            return this.stringValidation();
        },

        stringValidation: function() {
            var value = this.elementValue,
                isValid = value && value.length > 0;

            return isValid;
        },

        loginValidation: function() {
            var value = this.elementValue,
                isValid = value && value.length > 2;

            if (!isValid) {
                this.errorText = 'Please enter at least 3 characters';
            }
            return isValid;
        },

        passwordValidation: function() {
            var value = this.elementValue,
                isValid = value && value.length > 5;

            if (!isValid) {
                this.errorText = 'Please enter at least 6 characters';
            }
            return isValid;
        },

        numberValidation: function() {
            var value = this.elementValue;

            return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value);
        },

        emailValidation: function() {
            var value = this.elementValue,
                isEmail = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);

            if (!isEmail) {
                this.errorText = 'Please enter a valid email address';
            }
            return isEmail;
        },

        matchValidation: function() {
            var value = this.elementValue,
                isMatching = value === $('input[name="'+this.rule.match+'"]', this.group.parent()).val();

            if (!isMatching) {
                isMatching = -1;
                this.errorText = 'Passwords must match';
            }
            return isMatching;
        },

        setValidationState: function(isValid) {
            $('span.help-block', this.group).remove();
            this.group.removeClass(this.validCls+' '+this.errorCls+' '+this.warningCls)
            if (isValid && isValid !== -1) {
                this.group.addClass(this.validCls);
            } else if (isValid === -1) {
                this.group.addClass(this.warningCls);
                $('<span class="help-block">'+this.errorText+'</span>').appendTo(this.parent());
            } else {
                this.group.addClass(this.errorCls);
                $('<span class="help-block">'+this.errorText+'</span>').appendTo(this.parent());
            }
        }

    });


    // MAP

    $.extend($.fn, {

        googleMap: function(config) {
            var elements = [];
            this.each(function() {
                var $element = $(this);
                $element.createMap();
                elements.push($element);
            });
            this.elements = elements;

            return this;
        },

        createMap: function() {
            var latlng = new google.maps.LatLng(-34.397, 150.644),
                myOptions = {
                zoom: 10,
                center: latlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            this.mapMarkers = [];
            this.geocoder = new google.maps.Geocoder();
            this.map = new google.maps.Map(this.context, myOptions);
            this.centerMap(latlng);
            this.addMapMarker(latlng);
        },

        centerMap: function(latlng) {
            this.map.setCenter(latlng);
        },

        addMapMarker: function(latlng) {
            var marker = new google.maps.Marker({
                map: this.map, 
                position: latlng,
                draggable: true
            });

            for (var i = 0, l = this.mapMarkers.length; i < l; i++) {
                this.mapMarkers[i].setMap(null);
            }

            this.addMarkerEvents(marker);
            this.mapMarkers.push(marker);
        },

        addMarkerEvents: function(marker) {
            var scope = this;
            google.maps.event.addListener(marker, 'drag', function() {
                // updateMarkerStatus('Dragging...');
                scope.updateMarkerPosition(marker.getPosition());
            });

            google.maps.event.addListener(marker, 'dragend', function() {
                // updateMarkerStatus('Drag ended');
                scope.geocodePosition(marker.getPosition());
            });
        },

        geocodePosition: function(position) {
            var scope = this, address = [];
            this.geocoder.geocode({
                latLng: position
            }, function(responses) {
                if (responses && responses.length > 0) {
                    var types,
                        response = responses[0],
                        components = response.address_components;

                    for (var i = 0, l = components.length; i < l; i++) {
                        types = components[i].types;
                        if (types.indexOf('locality') !== -1) {
                            address.unshift(components[i].long_name);
                        } else if (types.indexOf('country') !== -1) {
                            address.push(components[i].long_name);
                        }
                    }
                    address = address.join(', ');
                } else {
                    address = '';
                }
                scope.updateLocationField(address);
            });
        },

        updateMarkerPosition: function(position) {
            var $position = $('.help-position', this.parent()),
                lat = Math.round(position.lat()*1000)/1000,
                lng = Math.round(position.lng()*1000)/1000,
                html = 'latitude: ' + lat + ' longitude: ' + lng;

            if (!$position.length) {                
                $position = $('<span class="help-block help-position"></span>')
                            .appendTo($('input[name="location"]', this.parent()).parent());
            }
            
            $position.html(html);
        },

        updateLocationField: function(address) {
            $location = $('input[name="location"]', this.parent());
            $location.val(address)
        }

    });


    var form = $('#register-form');

    if (form.length) {

        var maps = $('#map-canvas', form).googleMap();

        form.validator({
            rules: {
                login: {required: true, type: 'login', remote: checkLoginAvailability},
                email: {required: true, type: 'email', remote: checkEmailAvailability},
                password: {required: true, type: 'password'},
                password2: {required: true, type: 'password', match: 'password'},
                gender: {required: true, type: 'string'},
                range1: {required: true, type: 'range'},
                range2: {required: true, type: 'range'},
                'birthday-day': {required: true, type: 'number'},
                'birthday-month': {required: true, type: 'number'},
                'birthday-year': {required: true, type: 'number'},
                location: {required: true, type: 'string', remote: checkLocation, googleMap: maps.elements[0]}
            }
        });

        $('#login', form).focus();

    }

});

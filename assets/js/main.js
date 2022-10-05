(function () {
	("use strict");

	/**
	 * Easy selector helper function
	 */
	const select = (el, all = false) => {
		if (all) {
			return [...document.querySelectorAll(el)];
		} else {
			return document.querySelector(el);
		}
	};

	/**
	 * Easy event listener function
	 */
	const on = (type, el, listener, all = false) => {
		let selectEl = select(el, all);
		if (selectEl) {
			if (all) {
				selectEl.forEach((e) => e.addEventListener(type, listener));
			} else {
				selectEl.addEventListener(type, listener);
			}
		}
	};
	/**
	 * Scrolls to an element with header offset
	 */
	const scrollto = (el) => {
		let elementPos = select(el).offsetTop;
		window.scrollTo({
			top: elementPos,
			behavior: "smooth",
		});
	};

	/**
	 * Nav toggle
	 */
	let navToggle = select(".nav-toggle");
	let navbarMenu = select("#navbar-menu");
	let navbarForm = select("#navbar-form");

	on("click", ".nav-toggle", function (e) {
		if (navbarForm.classList.contains("navbar-open")) {
			navbarForm.classList.remove("navbar-open");
			navToggle.classList.toggle("opened");
			document.body.classList.toggle("fixed-body");
		} else {
			navbarMenu.classList.toggle("navbar-open");
			navToggle.classList.toggle("opened");
			document.body.classList.toggle("fixed-body");
		}
	});
	on("click", ".form-toggle", function (e) {
		navbarForm.classList.add("navbar-open");
		navbarMenu.classList.remove("navbar-open");
	});
	on("click", ".form-button", function (e) {
		navbarForm.classList.add("navbar-open");
		navbarMenu.classList.remove("navbar-open");
		document.documentElement.scrollTop = 0;
		navToggle.classList.toggle("opened");
		document.body.classList.toggle("fixed-body");
	});

	/**
	 * Scrool with ofset on links with a class name .scrollto
	 */
	on(
		"click",
		".scrollto",
		function (e) {
			if (select(this.hash)) {
				e.preventDefault();

				let navbar = select("#navbar-menu");
				if (navbar.classList.contains("navbar-open")) {
					navbar.classList.remove("navbar-open");
					let navbarToggle = select(".nav-toggle");
					navbarToggle.classList.remove("opened");
					document.body.classList.toggle("fixed-body");
				}
				scrollto(this.hash);
			}
		},
		true
	);

	/**
	 * Preloader
	 */
	let preloader = select("#preloader");
	let preloaderLogo = select(".logo-animation");
	if (preloader) {
		window.addEventListener("load", () => {
			preloaderLogo.classList.add("logo-animated");
			setTimeout(() => {
				preloader.style.opacity = 0;
				preloader.style.transition = `opacity 1000ms`;
				setTimeout(() => {
					preloaderLogo.style.zIndex = "11";
					preloader.remove();
				}, "1000");
			}, "2000");
		});
	}

	/**
	 * Custom cursor
	 */

	var mediaQuery = window.matchMedia("(min-width: 500px)");

	if (mediaQuery.matches) {
		window.onload = function () {
			const cursor = curDot({
				easing: 4,
			});
			cursor.over(".text-stroke", {
				color: "#000",
				scale: 1.2,
				background: "#fff",
			});
			cursor.over(".element-3", {
				scale: 0.5,
				background: "#fff",
			});
			cursor.over(".invert", {
				background: "#fff",
				color: "green",
			});
			cursor.over("._autoplay_vid", {
				background: "#fff",
			});
		};
	}

	/**
	 * Smoth scroll and AOS animations
	 */

	butter.init({ cancelOnTouch: true });

	AOS.init({
		once: true,
		mirror: false,
		disable: "mobile",
	});
	/**
	 * Rolling effect
	 */
	let elements = document.querySelectorAll(".rolling-text");

	elements.forEach((element) => {
		let innerText = element.innerText;
		element.innerHTML = "";

		let textContainer = document.createElement("div");
		textContainer.classList.add("block");

		for (let letter of innerText) {
			let span = document.createElement("span");
			span.innerText = letter.trim() === "" ? "\xa0" : letter;
			span.classList.add("letter");
			textContainer.appendChild(span);
		}

		element.appendChild(textContainer);
		element.appendChild(textContainer.cloneNode(true));
	});

	elements.forEach((element) => {
		element.addEventListener("mouseover", () => {
			element.classList.remove("play");
		});
	});

	/**
	 * Video autoplay
	 */

	//gett all the video elements on the document
	let vids = document.getElementsByClassName("_autoplay_vid");
	fraction = 0.99;
	//loop through all the video elements
	for (let i = vids.length - 1; i >= 0; i--) {
		//pause all the videos by default
		vids[i].pause();
		vids[i].onclick = function () {
			this.classList.toggle("on");
			this.parentNode.classList.toggle("play");
			if (this.classList.contains("on")) {
				this.muted = false;
			} else {
				this.muted = true;
			}
		};
	}

	window.onscroll = function () {
		for (let i = vids.length - 1; i >= 0; i--) {
			//get current scrol position
			let x = vids[i].offsetLeft,
				y = vids[i].offsetTop,
				w = vids[i].offsetWidth,
				h = vids[i].offsetHeight,
				r = x + w, //right
				b = y + h, //bottom
				visibleX,
				visibleY,
				visible;

			visibleX = Math.max(
				0,
				Math.min(
					w,
					window.pageXOffset + window.innerWidth - x,
					r - window.pageXOffset
				)
			);
			visibleY = Math.max(
				0,
				Math.min(
					h,
					window.pageYOffset + window.innerHeight - y,
					b - window.pageYOffset
				)
			);
			visible = (visibleX * visibleY) / (w * h);

			if (visible > fraction) {
				//Play video if the current scroll position
				//is between the top and bottom of the video element
				vids[i].play();
			} else {
				//else pause the video
				vids[i].pause();
			}
		}
	};

	let forms = document.querySelectorAll(".php-email-form");

	forms.forEach(function (e) {
		e.addEventListener("submit", function (event) {
			event.preventDefault();

			let thisForm = this;

			let action = thisForm.getAttribute("action");

			if (!action) {
				displayError(thisForm, "The form action property is not set!");
				return;
			}
			thisForm.querySelector(".loading").classList.add("d-block");
			thisForm.querySelector(".error-message").classList.remove("d-block");
			thisForm.querySelector(".sent-message").classList.remove("d-block");

			let formData = new FormData(thisForm);

			php_email_form_submit(thisForm, action, formData);
		});
	});

	function php_email_form_submit(thisForm, action, formData) {
		fetch(action, {
			method: "POST",
			body: formData,
			headers: { "X-Requested-With": "XMLHttpRequest" },
		})
			.then((response) => {
				if (response.ok) {
					return response.text();
				} else {
					throw new Error(
						`${response.status} ${response.statusText} ${response.url}`
					);
				}
			})
			.then((data) => {
				thisForm.querySelector(".loading").classList.remove("d-block");
				if (data.trim() == "OK") {
					thisForm.querySelector(".sent-message").classList.add("d-block");
					thisForm.reset();
				} else {
					throw new Error(
						data
							? data
							: "Form submission failed and no error message returned from: " +
							  action
					);
				}
			})
			.catch((error) => {
				displayError(thisForm, error);
			});
	}

	function displayError(thisForm, error) {
		thisForm.querySelector(".loading").classList.remove("d-block");
		thisForm.querySelector(".error-message").innerHTML = error;
		thisForm.querySelector(".error-message").classList.add("d-block");
	}

	/**
	 * Phone mask
	 */

	[].forEach.call(document.querySelectorAll(".tel"), function (input) {
		var keyCode;
		function mask(event) {
			event.keyCode && (keyCode = event.keyCode);
			var pos = this.selectionStart;
			if (pos < 3) event.preventDefault();
			var matrix = "+7 (___) ___ ____",
				i = 0,
				def = matrix.replace(/\D/g, ""),
				val = this.value.replace(/\D/g, ""),
				new_value = matrix.replace(/[_\d]/g, function (a) {
					return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
				});
			i = new_value.indexOf("_");
			if (i != -1) {
				i < 5 && (i = 3);
				new_value = new_value.slice(0, i);
			}
			var reg = matrix
				.substr(0, this.value.length)
				.replace(/_+/g, function (a) {
					return "\\d{1," + a.length + "}";
				})
				.replace(/[+()]/g, "\\$&");
			reg = new RegExp("^" + reg + "$");
			if (
				!reg.test(this.value) ||
				this.value.length < 5 ||
				(keyCode > 47 && keyCode < 58)
			)
				this.value = new_value;
			if (event.type == "blur" && this.value.length < 5) this.value = "";
		}

		input.addEventListener("input", mask, false);
		input.addEventListener("focus", mask, false);
		input.addEventListener("blur", mask, false);
		input.addEventListener("keydown", mask, false);
	});

	/**
	 * File input
	 */

	let fields = document.querySelectorAll(".field__file");
	Array.prototype.forEach.call(fields, function (input) {
		let label = input.nextElementSibling,
			labelVal = label.querySelector(".field__file-fake").innerText;

		input.addEventListener("change", function (e) {
			let countFiles = "";
			if (this.files && this.files.length >= 1) countFiles = this.files.length;

			if (countFiles)
				label.querySelector(".field__file-fake").innerText =
					"Выбрано файлов: " + countFiles;
			else label.querySelector(".field__file-fake").innerText = labelVal;
		});
	});
})();

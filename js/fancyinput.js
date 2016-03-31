(function(){


    var keypass = "secret";
    var success = "you're in!";
    var greeting = "hello! type the password";
    var passwordContainer = "password-form";
    var input;
    var cursor;
    var hiddenInput;
    var content = [];
    var lastContent = "", targetContent = "";
    var inputLock = false;
    var autoWriteTimer;
    var pass = false;
    var isMobile, isIE;

    window.onload = function() {

        isMobile = navigator && navigator.platform && navigator.platform.match(/^(iPad|iPod|iPhone)$/);

        isIE = (navigator.appName == 'Microsoft Internet Explorer');

        input = document.getElementById('input');

        hiddenInput = document.getElementById('hiddenInput');
        hiddenInput.focus();

        cursor = document.createElement('cursor');
        cursor.setAttribute('class', 'blink');
        cursor.innerHTML = "|";

        if (!isMobile && !isIE) input.appendChild(cursor);

        function dissapear() {
            var container = document.getElementById(passwordContainer);
            container.style.transform = 'translateY(200%)';
            setTimeout(function() {
                container.remove();
            }, 1500);
        }

        function refresh(pass) {

            inputLock = true;

            if (targetContent.length - lastContent.length == 0) {
                inputLock = false;
                return;
            }

            var v = targetContent.substring(0, lastContent.length + 1);

            content = [];

            var blinkPadding = false;

            for (var i = 0; i < v.length; i++) {
                var l = v.charAt(i);

                var d = document.createElement('div');
                d.setAttribute('class', 'letterContainer');

                var d2 = document.createElement('div');

                var animClass = (i % 2 == 0) ? 'letterAnimTop' : 'letterAnimBottom';

                var letterClass = (lastContent.charAt(i) == l) ? 'letterStatic' : animClass; //if it's an old letter don't animate, only animate if it's new.

                if (letterClass != 'letterStatic') blinkPadding = true;

                d2.setAttribute('class', letterClass);

                d.appendChild(d2);
                
                if (pass===true) {d2.innerHTML = '*';}
                else {d2.innerHTML = l;}
          
                content.push(d);
            }

            input.innerHTML = '';

            for (var i = 0; i < content.length; i++) {
                input.appendChild(content[i]);
            }

            cursor.style.paddingLeft = (blinkPadding) ? '11px' : '0';

            if (!isMobile && !isIE) input.appendChild(cursor);

            if (targetContent.length - lastContent.length > 1) setTimeout(refresh, 150);
             else inputLock = false;

            lastContent = v;

            //if the lastContent was the success message -> dissapear the screen
            if (lastContent === success) dissapear();
            if (lastContent === greeting) {
                setTimeout(function() {
                    document.getElementById('clickme').style.opacity=1;
                    document.getElementById('clickme').style.filter = "alpha(opacity=100)";
                }, 500);
            }
        }

        if (document.addEventListener) {

            document.addEventListener('touchstart', function(e) {
                if (!inputLock) {
                    clearInterval(autoWriteTimer);
                    targetContent = lastContent;
                    hiddenInput.focus();
                }
            }, false);

            document.addEventListener('click', function(e) {
                clearInterval(autoWriteTimer);
                targetContent = lastContent;
                if (!inputLock) hiddenInput.focus(); 
            }, false);

            if (!isIE) {
                // Input event is buggy on IE, so don't bother
                // (http://msdn.microsoft.com/en-us/library/gg592978(v=vs.85).aspx#feedback)
                // We will use a timer instead (below)
                hiddenInput.addEventListener('input', function(e) {
                    e.preventDefault();
                    targetContent = hiddenInput.value;

                    if (targetContent.toLowerCase() === keypass && !inputLock) {
                        console.log('bingo');
                        hiddenInput.value = "";
                        targetContent=success;
                        refresh(false);
                    }
                    else if (!inputLock) refresh(true);
                }, false);
            } else {
                setInterval(function() {
                    targetContent = hiddenInput.value;

                    if (targetContent === keypass && !inputLock) {
                        console.log('bingo');
                        hiddenInput.value = "";
                        lastContent = "";
                        targetContent=success;
                        refresh(false);
                    }
                    else if (targetContent != lastContent && !inputLock) refresh(true);
                }, 100);
            }

        }

        autoWriteTimer = setTimeout(function() {
            if (lastContent != "") return;
            targetContent = greeting;
            refresh(false);
        }, 1000);
    }

})();


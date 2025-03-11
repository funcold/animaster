addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().addFadeIn(5000).play(block);
        });
    
    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().resetFadeIn(block);
        });
    
    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().addFadeOut(5000).play(block);
        });
    
    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().resetFadeOut(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(1000, {x: 100, y: 10}).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().addScale(1000, 1.25).play(block);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 1000, 1.25);
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000, 1.25);
        });  
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            setInterval(x => animaster().heartBeating(block, 1000, 1.25), 1000);
        });    
}

function animaster() {
    class AnimationOperation {
        constructor(type, params) {
            this.type = type;
            this.params = params;
        }
    }

    let _steps = [];

    function fadeIn(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function addFadeIn(duration) {
        _steps.push(new AnimationOperation('fadeIn', { duration: duration } ));
        return this;
    }

    function resetFadeIn(element) {
        fadeOut(element, 0);
    }

    function fadeOut(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function addFadeOut(duration) {
        _steps.push(new AnimationOperation('fadeOut', { duration: duration } ));
        return this;
    }

    function resetFadeOut(element) {
        fadeIn(element, 0);
    }

    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    function addMove(duration, translation) {
        _steps.push(new AnimationOperation('move', { duration: duration, translation: translation } ));
        return this;
    }

    function scale(element, duration, ratio) {
        element.style.transitionDuration =  `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    function addScale(duration, ratio) {
        _steps.push(new AnimationOperation('scale', { duration: duration, ratio: ratio } ));
        return this;
    }

    function play(element) {
        for (let step of _steps) {
            switch (step.type) {
                case 'move':
                    move(element, step.params.duration, step.params.translation);
                    break;
                case 'scale':
                    scale(element, step.params.duration, step.params.ratio);
                    break;
                case 'fadeIn':
                    fadeIn(element, step.params.duration);
                    break;
                case 'fadeOut':
                    fadeOut(element, step.params.duration);
                    break;
            }
        }
        _steps = []
    function moveAndHide(element, duration) {
        this.move(element, duration * 2 / 5, {x: 100, y: 20});
        this.fadeOut(element, duration * 3 / 5);
    }

    function showAndHide(element, duration) {
        this.fadeIn(element, duration / 3);
        setTimeout(x => this.fadeOut(element, duration / 3), duration / 3)
    }

    function heartBeating(element) {
        this.scale(element, 500, 1.4);
        setTimeout(x => this.scale(element, 500, 1), 100);
        //setInterval(x => beat(element), 1000);
    }

    return {
        fadeIn,
        resetFadeIn,
        resetFadeOut,
        fadeOut,
        move,
        scale,
        addMove,
        addScale,
        addFadeIn,
        addFadeOut,
        play,
        moveAndHide,
        showAndHide,
        heartBeating
    };
}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}

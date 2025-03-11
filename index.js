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
        play
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

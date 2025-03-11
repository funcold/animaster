addListeners();

function addListeners() {
    document.getElementById('borderRadiusPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('borderRadiusBlock');
            animaster().addBorderRadius(500, 50).play(block);
        });
    
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

    let heartBeatingAnimation = null;

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeatingAnimation = animaster().heartBeating(block); 
        });
        
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            if (heartBeatingAnimation) {
                heartBeatingAnimation.stop(); 
            }
        }); 
    
    const worryAnimationHandler = animaster()
        .addMove(200, { x: 80, y: 0 })
        .addMove(200, { x: 0, y: 0 })
        .addMove(200, { x: 80, y: 0 })
        .addMove(200, { x: 0, y: 0 })
        .buildHandler();
    
    document
        .getElementById('worryAnimationBlock')
        .addEventListener('click', worryAnimationHandler); 
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
        return new Promise(resolve => {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
            setTimeout(resolve, duration);
        });
    }

    function addFadeIn(duration) {
        _steps.push(new AnimationOperation('fadeIn', { duration: duration } ));
        return this;
    }

    function resetFadeIn(element) {
        fadeOut(element, 0);
    }

    function fadeOut(element, duration) {
        return new Promise(resolve => {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
            setTimeout(resolve, duration);
        });
    }

    function addFadeOut(duration) {
        _steps.push(new AnimationOperation('fadeOut', { duration: duration } ));
        return this;
    }

    function resetFadeOut(element) {
        fadeIn(element, 0);
    }

    function move(element, duration, translation) {
        return new Promise(resolve => {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
            setTimeout(resolve, duration);
        });
    }

    function addMove(duration, translation) {
        _steps.push(new AnimationOperation('move', { duration: duration, translation: translation } ));
        return this;
    }

    function scale(element, duration, ratio)
    {
        return new Promise(resolve => {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
            element.style.borderRadius = `${ratio}%`;
            setTimeout(resolve, duration);
        });
    }  

    function addScale(duration, ratio) {
        _steps.push(new AnimationOperation('scale', { duration: duration, ratio: ratio } ));
        return this;
    }

    function borderRadius(element, duration, ratio) {
        return new Promise(resolve => {
            element.style.transitionDuration = `${duration}ms`;
            element.style.borderRadius = `${ratio}%`;
            setTimeout(resolve, duration);
        });
    }

    function addBorderRadius(duration, ratio) {
        _steps.push(new AnimationOperation('borderRadius', { duration: duration, ratio: ratio } ));
        return this;
    }

    function delay(delay) {
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    function addDelay(delay) {
        _steps.push(new AnimationOperation('delay', { delay: delay } ));
        return this
    }

    async function innerPlay(element) {
        for (let step of _steps) {
            console.log(step.type);
            switch (step.type) {
                case 'move':
                    await move(element, step.params.duration, step.params.translation);
                    break;
                case 'scale':
                    await scale(element, step.params.duration, step.params.ratio);
                    break;
                case 'fadeIn':
                    await fadeIn(element, step.params.duration);
                    break;
                case 'fadeOut':
                    await fadeOut(element, step.params.duration);
                    break;
                case 'borderRadius':
                    await borderRadius(element, step.params.duration, step.params.ratio);
                    break;
                case 'delay':
                    await delay(step.params.delay);
                    break;
            }
        }
    }

    async function play(element, cycled=false) {
        if (!cycled) {
            innerPlay(element);
            _steps = [];
            return;
        } 

        return setInterval(x => innerPlay(element), 1200);    
    }

    function moveAndHide(element, duration) {
        this.addMove(duration * 2 / 5, {x: 100, y: 20}).addFadeOut(duration * 3 / 5).play(element);
    }

    function showAndHide(element, duration) {
        this.addFadeIn(duration / 3).addDelay(duration / 3).addFadeOut(duration / 3).play(element);
    }

    function heartBeating(element) {
        let intervalId = null;
        this.addScale(500, 1.4).addDelay(100).addScale(500, 1).play(element, cycled=true).then((res) => intervalId = res)
    
        return {
            stop: () => {
                if (intervalId) {
                    clearInterval(intervalId); 
                    intervalId = null; 
                }
            }
        };
    }

    function buildHandler() {
        return async (event) => {
            const element = event.currentTarget;
            play(element);
        };
    }

    return {
        fadeIn,
        resetFadeIn,
        resetFadeOut,
        fadeOut,
        move,
        scale,
        delay,
        addMove,
        addScale,
        addFadeIn,
        addFadeOut,
        addBorderRadius,
        addDelay,
        play,
        moveAndHide,
        showAndHide,
        heartBeating,
        buildHandler
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

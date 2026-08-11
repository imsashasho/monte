const transformationValues = (type) => {
    switch (type) {
        case 'tablet':
            return {
                from: {
                    y: 0,
                },
                to: {
                    y: 0,
                }
            }

        default:
            return {
                from: {},
                to: {}
            }
    }
}


export function paralaxEffect(container, deviceType = 'desktop') {
    const el = container;
    gsap.timeline({
        defaults: {
            ease: 'none'
        },
        scrollTrigger: {
            trigger: '[data-about-scene]',
            scrub: true,
        }
    })
        .fromTo(el.querySelector('.paralax-transform'), {
            y: -300,
            ...transformationValues(deviceType).from
        }, {
            y: 300,
            ...transformationValues(deviceType).to
        })
        .fromTo(el.querySelector('.paralax-scale'), {
            scale: 1.4
        }, {
            scale: 1
        }, '<')
}
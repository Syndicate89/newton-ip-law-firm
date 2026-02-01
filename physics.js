/* =========================================
   Newton IP Law Firm - physics.js
   Refined interaction with ejelaw style
   ========================================= */

(function () {
    'use strict';

    const Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite,
        Mouse = Matter.Mouse,
        MouseConstraint = Matter.MouseConstraint,
        Events = Matter.Events;

    let engine, render, runner;
    const canvas = document.getElementById('physics-canvas');

    function init() {
        if (!canvas) return;

        // Create engine
        engine = Engine.create();
        engine.gravity.y = 0.8;

        // Create renderer (invisible mostly, just for particles)
        render = Render.create({
            canvas: canvas,
            engine: engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                background: 'transparent',
                wireframes: false,
                pixelRatio: window.devicePixelRatio
            }
        });

        // Add boundaries
        const wallOptions = { isStatic: true, render: { visible: false } };
        const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 50, window.innerWidth, 100, wallOptions);
        Composite.add(engine.world, [ground]);

        // Add floating "intellectual property" particles
        createParticles();

        // Mouse constraint for interaction
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });
        Composite.add(engine.world, mouseConstraint);
        render.mouse = mouse;

        // Run runner
        runner = Runner.create();
        Runner.run(runner, engine);
        Render.run(render);

        // Entrance animation trigger
        setTimeout(() => {
            document.body.classList.add('animate-ready');
        }, 100);

        window.addEventListener('resize', handleResize);
    }

    function createParticles() {
        const particles = [];
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * -500; // Drop from top
            const radius = Math.random() * 5 + 2;

            const circle = Bodies.circle(x, y, radius, {
                restitution: 0.5,
                friction: 0.1,
                render: {
                    fillStyle: i % 3 === 0 ? '#C5A059' : '#001A3D',
                    opacity: 0.3
                }
            });
            particles.push(circle);
        }
        Composite.add(engine.world, particles);
    }

    function handleResize() {
        render.canvas.width = window.innerWidth;
        render.canvas.height = window.innerHeight;
        render.options.width = window.innerWidth;
        render.options.height = window.innerHeight;
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Scroll effect: Move particles or change gravity slightly
    window.addEventListener('scroll', () => {
        const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        engine.gravity.y = 0.8 + scrollPercent * 0.5;
    });

    // Modal Interaction
    const overlay = document.getElementById('modal-overlay');
    const openBtns = document.querySelectorAll('.open-modal');
    const closeBtns = document.querySelectorAll('.close-modal');
    const modals = document.querySelectorAll('.modal');

    openBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal');
            const targetModal = document.getElementById(modalId);

            overlay.classList.add('active');
            modals.forEach(m => m.style.display = 'none');
            targetModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

})();

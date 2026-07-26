document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Particle Canvas Simulation
    // ----------------------------------------------------
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const maxParticles = 60;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 0.5;
                this.speedX = Math.random() * 0.2 - 0.1;
                this.speedY = Math.random() * -0.4 - 0.1; // Float upwards
                this.opacity = Math.random() * 0.4 + 0.1;
                this.fadeSpeed = Math.random() * 0.005 + 0.002;
            }

            update(mouseX, mouseY) {
                this.x += this.speedX;
                this.y += this.speedY;

                // Wrap around edges
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0) {
                    this.y = canvas.height;
                    this.x = Math.random() * canvas.width;
                }

                // Mouse push effect
                if (mouseX && mouseY) {
                    const dx = this.x - mouseX;
                    const dy = this.y - mouseY;
                    const dist = Math.hypot(dx, dy);
                    if (dist < 100) {
                        const force = (100 - dist) / 100;
                        this.x += (dx / dist) * force * 1.5;
                        this.y += (dy / dist) * force * 1.5;
                    }
                }
            }

            draw() {
                ctx.fillStyle = `rgba(139, 92, 246, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }

        let mouseX = null;
        let mouseY = null;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouseX = null;
            mouseY = null;
        });

        let isParticleCanvasVisible = true;
        if ('IntersectionObserver' in window) {
            const canvasObs = new IntersectionObserver((entries) => {
                entries.forEach(e => { isParticleCanvasVisible = e.isIntersecting; });
            }, { threshold: 0.01 });
            canvasObs.observe(canvas);
        }

        const animateParticles = () => {
            if (isParticleCanvasVisible && document.visibilityState === 'visible') {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach((p) => {
                    p.update(mouseX, mouseY);
                    p.draw();
                });
            }
            requestAnimationFrame(animateParticles);
        };
        animateParticles();
    }

    // ----------------------------------------------------
    // 2. Multi-layered 3D Interactive Parallax
    // ----------------------------------------------------
    const container = document.getElementById('hero-visual-wrapper');
    const perspectiveWrapper = document.getElementById('dashboard-perspective');
    const cards = document.querySelectorAll('.glass-card');
    const ambientOrb = document.getElementById('ambient-glow-orb');

    if (container && perspectiveWrapper) {
        let isHovered = false;
        let isContainerVisible = true;
        let targetRotateX = 12;
        let targetRotateY = -16;
        let currentRotateX = 12;
        let currentRotateY = -16;
        
        let mousePos = { x: 0, y: 0 };

        if ('IntersectionObserver' in window) {
            const containerObs = new IntersectionObserver((entries) => {
                entries.forEach(e => { isContainerVisible = e.isIntersecting; });
            }, { threshold: 0.05 });
            containerObs.observe(container);
        }

        // Precompute card depth once to avoid 60fps regex parsing overhead
        const cardItems = Array.from(cards).map((card) => {
            const styleAttr = card.getAttribute('style') || '';
            const match = styleAttr.match(/--card-depth:\s*(-?\d+)px/);
            const depth = match ? parseFloat(match[1]) : 0;
            return { el: card, depth };
        });

        container.addEventListener('mouseenter', () => {
            isHovered = true;
        });

        container.addEventListener('mouseleave', () => {
            isHovered = false;
            targetRotateX = 12;
            targetRotateY = -16;
            mousePos = { x: 0, y: 0 };
        });

        container.addEventListener('mousemove', (e) => {
            if (!isContainerVisible) return;
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const normalizedX = (x / rect.width) * 2 - 1;
            const normalizedY = (y / rect.height) * 2 - 1;
            
            mousePos = { x: normalizedX, y: normalizedY };

            targetRotateY = -16 + (normalizedX * 12);
            targetRotateX = 12 - (normalizedY * 8);
        }, { passive: true });

        // Loop to smoothly interpolate transformations for 60fps feel
        const updateTransforms = () => {
            if (isContainerVisible && document.visibilityState === 'visible') {
                currentRotateX += (targetRotateX - currentRotateX) * 0.1;
                currentRotateY += (targetRotateY - currentRotateY) * 0.1;

                perspectiveWrapper.style.transform = `rotateY(${currentRotateY}deg) rotateX(${currentRotateX}deg) rotateZ(-1deg)`;

                // Push individual cards forward/backward dynamically
                for (let i = 0; i < cardItems.length; i++) {
                    const item = cardItems[i];
                    let shiftX = 0;
                    let shiftY = 0;

                    if (isHovered) {
                        shiftX = mousePos.x * (item.depth * 0.25);
                        shiftY = mousePos.y * (item.depth * 0.25);
                    }

                    item.el.style.transform = `translateZ(${item.depth}px) translateX(${shiftX}px) translateY(${shiftY}px)`;
                }

                if (ambientOrb) {
                    const orbShiftX = mousePos.x * 20;
                    const orbShiftY = mousePos.y * 20;
                    ambientOrb.style.transform = `translate3d(${orbShiftX}px, ${orbShiftY}px, 0)`;
                }
            }

            requestAnimationFrame(updateTransforms);
        };
        updateTransforms();
    }

    // ----------------------------------------------------
    // 3. Analytics Metric Live Counter Simulation
    // ----------------------------------------------------
    const metricValEl = document.getElementById('analytics-metric');
    if (metricValEl) {
        let val = parseInt(metricValEl.textContent.replace(/,/g, ''), 10);
        setInterval(() => {
            // Randomly increase value slightly
            val += Math.floor(Math.random() * 5) + 1;
            metricValEl.textContent = val.toLocaleString();
        }, 3500);
    }

    // ----------------------------------------------------
    // 4. Live Chatbot & Workflow State Simulation Loop
    // ----------------------------------------------------
    const chatContainer = document.getElementById('chat-messages-container');
    const workflowNodes = document.querySelectorAll('.workflow-node');
    const workflowPills = document.querySelector('.card-workflow .badge-status');

    if (chatContainer) {
        let step = 0;
        
        const resetChatAndWorkflow = () => {
            chatContainer.innerHTML = `
                <div class="chat-message incoming">
                    <p>How can I automate my client intake pipeline today?</p>
                </div>
                <div class="chat-message outgoing">
                    <p>I can deploy a system to extract leads, drafts proposals, and schedule directly in your CRM. Should I run the draft workflow?</p>
                </div>
                <div class="chat-message incoming">
                    <p>Yes please, trigger it now.</p>
                </div>
                <div class="chat-message outgoing status-update">
                    <svg class="spinner" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="25" cy="25" r="20" fill="none" stroke="#8B5CF6" stroke-width="5" stroke-linecap="round"></circle>
                    </svg>
                    <span>Generating proposal & scheduling invite...</span>
                </div>
            `;
            
            // Reset workflow cards
            workflowNodes.forEach(node => node.classList.remove('active', 'completed'));
            workflowNodes[0].classList.add('active'); // Start with first active
            if (workflowPills) {
                workflowPills.textContent = 'Triggered';
                workflowPills.style.color = '#8B5CF6';
                workflowPills.style.borderColor = 'rgba(139, 92, 246, 0.3)';
            }
        };

        const runWorkflowStep = () => {
            step++;
            if (step === 1) {
                // First action: Lead capture completes, research starts
                workflowNodes[0].classList.remove('active');
                workflowNodes[0].classList.add('completed');
                workflowNodes[1].classList.add('active');
            } else if (step === 2) {
                // Second action: AI research completes, sync starts
                workflowNodes[1].classList.remove('active');
                workflowNodes[1].classList.add('completed');
                workflowNodes[2].classList.add('active');
            } else if (step === 3) {
                // Third action: Workflow completion
                workflowNodes[2].classList.remove('active');
                workflowNodes[2].classList.add('completed');
                
                // Update workflow status pill
                if (workflowPills) {
                    workflowPills.textContent = 'Completed';
                    workflowPills.style.color = '#10B981';
                    workflowPills.style.borderColor = 'rgba(16, 185, 129, 0.3)';
                }

                // Append completion message to chatbot
                const spinnerMessage = chatContainer.querySelector('.status-update');
                if (spinnerMessage) {
                    spinnerMessage.remove();
                }
                const successMsg = document.createElement('div');
                successMsg.className = 'chat-message outgoing';
                successMsg.innerHTML = '<p>🎉 CRM synced successfully. Proposal email sent, and audit meeting confirmed on calendar!</p>';
                chatContainer.appendChild(successMsg);
                chatContainer.scrollTop = chatContainer.scrollHeight;
            } else if (step > 4) {
                // Restart cycle
                step = 0;
                resetChatAndWorkflow();
            }
        };

        // Initialize state
        resetChatAndWorkflow();

        // Run automation step increments every 3.5 seconds
        setInterval(runWorkflowStep, 3500);
    }

    // ----------------------------------------------------
    // 5. Spotlight Hover & Micro-tilt Effect on Glass Panels
    // ----------------------------------------------------
    const glassPanels = document.querySelectorAll('.glass-panel');
    glassPanels.forEach((panel) => {
        panel.addEventListener('mousemove', (e) => {
            const rect = panel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            panel.style.setProperty('--mouse-x', `${x}px`);
            panel.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // ----------------------------------------------------
    // 7. Master Redesign: Nova — AI Business Consultant Engine
    // ----------------------------------------------------
    const consultantChatBody = document.getElementById('consultant-chat-body');
    const consultantInput = document.getElementById('consultant-input');
    const btnSendConsultant = document.getElementById('btn-send-consultant');
    const chipBtns = document.querySelectorAll('.chip-btn');
    const btnStartConsultation = document.getElementById('btn-start-consultation');

    // Conversation State Machine Tracker
    let novaState = {
        step: 0, // 0: Initial/Greeting, 1: Business Type, 2: Challenge, 3: Solution Type, 4: Recommendation & Lead, 5: Completed
        userData: {
            topic: '',
            businessType: '',
            challenge: '',
            solution: ''
        }
    };

    function appendUserMsg(text) {
        if (!consultantChatBody) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = 'consultant-msg user-msg';
        msgDiv.innerHTML = `<div class="msg-bubble"><p>${text}</p></div>`;
        consultantChatBody.appendChild(msgDiv);
        consultantChatBody.scrollTop = consultantChatBody.scrollHeight;
    }

    function appendAiReply(text, ctaButtonHtml = '') {
        if (!consultantChatBody) return;

        // Show subtle typing indicator before replying
        const typingDiv = document.createElement('div');
        typingDiv.className = 'consultant-msg ai-msg typing-msg';
        typingDiv.innerHTML = `<div class="msg-bubble"><p>Aria is analyzing...</p></div>`;
        consultantChatBody.appendChild(typingDiv);
        consultantChatBody.scrollTop = consultantChatBody.scrollHeight;

        setTimeout(() => {
            typingDiv.remove();
            const msgDiv = document.createElement('div');
            msgDiv.className = 'consultant-msg ai-msg';
            msgDiv.innerHTML = `<div class="msg-bubble"><p>${text}</p>${ctaButtonHtml}</div>`;
            consultantChatBody.appendChild(msgDiv);
            consultantChatBody.scrollTop = consultantChatBody.scrollHeight;
        }, 700);
    }

    // Handles Nova State Machine Transitions
    function processNovaInput(userText) {
        const lower = userText.toLowerCase();

        // Check if greeting
        if (lower === 'hi' || lower === 'hello' || lower === 'hey' || lower === 'greetings') {
            appendAiReply("Welcome 👋 Great to meet you.<br><br>Are you looking to build something new, automate an existing process, or explore AI opportunities for your business?");
            return;
        }

        // Quick action: Talk to a Human
        if (userText === 'Talk To A Human' || lower.includes('human') || lower.includes('person') || lower.includes('agent')) {
            appendAiReply("I'd be glad to connect you with our founding team directly. You can book a direct strategy call or message us directly.", 
                `<a href="#contact" class="btn btn-primary cta-chat-btn" style="margin-top:12px; display:inline-block; font-size:0.8rem; padding:8px 16px; border-radius:9999px;">💬 Speak With Founders</a>`
            );
            return;
        }

        // State Machine Step Handling
        if (novaState.step === 0) {
            novaState.userData.topic = userText;
            novaState.step = 1;
            appendAiReply(`Great goal! Exploring <strong>${userText}</strong> is a high-leverage move for your business.<br><br>What type of business or industry are you currently building for?`);
        } else if (novaState.step === 1) {
            novaState.userData.businessType = userText;
            novaState.step = 2;
            appendAiReply(`Got it! Building in the <strong>${userText}</strong> space.<br><br>What specific challenge or operational bottleneck are you trying to solve right now?`);
        } else if (novaState.step === 2) {
            novaState.userData.challenge = userText;
            novaState.step = 3;
            appendAiReply(`Understood. Addressing <em>"${userText}"</em> will unlock significant scale.<br><br>Are you looking for a custom AI automation system, a high-performance website, or a complete digital ecosystem?`);
        } else if (novaState.step === 3) {
            novaState.userData.solution = userText;
            novaState.step = 4;

            const recommendation = `Based on your goal of <strong>${novaState.userData.topic}</strong> in <strong>${novaState.userData.businessType}</strong>, a tailored <strong>${userText}</strong> can eliminate operational friction and accelerate growth.<br><br>Would you like our team to prepare a free AI strategy audit for your idea?`;
            const ctaBtn = `<button class="btn btn-primary cta-chat-btn" id="btn-chat-audit-trigger" style="margin-top:12px; font-size:0.85rem; padding:10px 20px; border-radius:9999px;">Book Free AI Audit</button>`;
            
            appendAiReply(recommendation, ctaBtn);
        } else {
            appendAiReply(`Perfect! Your requirements have been logged.<br><br>Our founding team will review your project specs and help you plan the next steps. Click below to confirm your audit:`,
                `<button class="btn btn-primary cta-chat-btn" id="btn-chat-audit-trigger-2" style="margin-top:12px; font-size:0.85rem; padding:10px 20px; border-radius:9999px;">Book Free AI Audit</button>`
            );
        }
    }

    // Event delegation for dynamically added CTA buttons inside chat
    document.addEventListener('click', (e) => {
        if (e.target && (e.target.id === 'btn-chat-audit-trigger' || e.target.id === 'btn-chat-audit-trigger-2')) {
            // Smooth scroll to hero audit CTA or trigger consultation action
            const heroCta = document.querySelector('.hero-actions .btn-primary');
            if (heroCta) heroCta.click();
        }
    });

    chipBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const topic = btn.getAttribute('data-topic');
            if (topic) {
                appendUserMsg(topic);
                processNovaInput(topic);
            }
        });
    });

    function handleSend() {
        if (!consultantInput) return;
        const text = consultantInput.value.trim();
        if (text) {
            appendUserMsg(text);
            consultantInput.value = '';
            processNovaInput(text);
        }
    }

    if (btnSendConsultant) {
        btnSendConsultant.addEventListener('click', handleSend);
    }

    if (consultantInput) {
        consultantInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleSend();
            }
        });
    }

    if (btnStartConsultation) {
        btnStartConsultation.addEventListener('click', () => {
            const consultantSec = document.getElementById('consultant-chat');
            if (consultantSec) {
                consultantSec.scrollIntoView({ behavior: 'smooth' });
                if (consultantInput) consultantInput.focus();
            }
        });
    }

    const btnDiscussProject = document.getElementById('btn-discuss-project');
    if (btnDiscussProject) {
        btnDiscussProject.addEventListener('click', () => {
            const consultantSec = document.getElementById('consultant');
            if (consultantSec) {
                consultantSec.scrollIntoView({ behavior: 'smooth' });
                if (consultantInput) consultantInput.focus();
            }
        });
    }

    // ----------------------------------------------------
    // 10. Aria — 3D AI Voice Consultant Engine
    // ----------------------------------------------------
    const btnToggleVoice = document.getElementById('btn-toggle-voice');
    const voiceBtnText = document.getElementById('voice-btn-text');
    const waveformBox = document.getElementById('waveform-box');
    const voiceStatusText = document.getElementById('voice-status-text');
    const avatarLips = document.getElementById('avatar-lips');
    let isVoiceActive = false;

    if (btnToggleVoice) {
        btnToggleVoice.addEventListener('click', () => {
            isVoiceActive = !isVoiceActive;

            if (isVoiceActive) {
                voiceBtnText.innerText = "End Voice Session";
                btnToggleVoice.style.background = "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)";
                if (waveformBox) waveformBox.classList.add('active-wave');
                if (voiceStatusText) {
                    voiceStatusText.innerHTML = `<span class="status-dot-green"></span> SPEAKING // ARIA VOICE ENGINE ACTIVE`;
                }

                // Female Voice Selection & Speech Synthesis
                if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                    const utterance = new SpeechSynthesisUtterance("Hi, I'm Aria, your AI business consultant. I help companies discover smarter ways to use AI, automation, and technology.");
                    
                    // Select realistic female voice from available system voices
                    const availableVoices = window.speechSynthesis.getVoices();
                    const femaleVoice = availableVoices.find(v => 
                        v.name.includes('Zira') || 
                        v.name.includes('Female') || 
                        v.name.includes('Google US English') || 
                        v.name.includes('Samantha') || 
                        v.name.includes('Victoria') || 
                        v.name.includes('Karen') || 
                        v.name.includes('Jenny') || 
                        v.name.includes('Hazel') ||
                        v.name.includes('Aria') ||
                        v.name.includes('Natural')
                    );

                    if (femaleVoice) {
                        utterance.voice = femaleVoice;
                    }
                    utterance.rate = 0.95;  // Smooth natural speech pace
                    utterance.pitch = 1.25; // Warm, sweet female tone
                    
                    // Lip sync pulse animation during speech
                    let lipInterval = setInterval(() => {
                        if (avatarLips) {
                            const h = Math.floor(Math.random() * 8) + 3;
                            avatarLips.style.height = `${h}px`;
                        }
                    }, 120);

                    utterance.onend = () => {
                        clearInterval(lipInterval);
                        if (avatarLips) avatarLips.style.height = '4px';
                        if (voiceStatusText) {
                            voiceStatusText.innerHTML = `<span class="status-dot-green"></span> LISTENING // AWAITING YOUR COMMAND`;
                        }
                    };

                    window.speechSynthesis.speak(utterance);
                }
            } else {
                voiceBtnText.innerText = "Start Voice Consultation";
                btnToggleVoice.style.background = "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)";
                if (waveformBox) waveformBox.classList.remove('active-wave');
                if (voiceStatusText) {
                    voiceStatusText.innerHTML = `<span class="status-dot-green"></span> ONLINE // READY FOR VOICE COMMANDS`;
                }
                if (avatarLips) avatarLips.style.height = '4px';
                if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                }
            }
        });
    }

    // ----------------------------------------------------
    // Hero: Cinematic Aria Chamber Parallax
    // ----------------------------------------------------
    const heroAriaVessel = document.getElementById('aria-vessel');
    const heroChamber = document.getElementById('hero-chamber');
    const ariaPortrait = document.getElementById('aria-portrait');

    if (heroAriaVessel && heroChamber) {
        // Natural blinking effect
        if (ariaPortrait) {
            setInterval(() => {
                ariaPortrait.style.opacity = '0.94';
                setTimeout(() => { ariaPortrait.style.opacity = '1.0'; }, 130);
            }, 4500);
        }

        // Mouse parallax on chamber
        heroChamber.addEventListener('mousemove', (e) => {
            const rect = heroChamber.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) / 30;
            const y = (e.clientY - rect.top - rect.height / 2) / 40;
            heroAriaVessel.style.transform = `translate3d(${x}px, ${y}px, 0) rotateY(${x * 0.6}deg)`;
        });

        heroChamber.addEventListener('mouseleave', () => {
            heroAriaVessel.style.transform = `translate3d(0, 0, 0) rotateY(0deg)`;
        });
    }

    // ----------------------------------------------------
    // Aria Strategy Status Cycling Animation
    // ----------------------------------------------------
    const ariaTypingText = document.getElementById('aria-typing-text');
    if (ariaTypingText) {
        const statuses = [
            "Analyzing your business...",
            "Creating your strategy...",
            "Ready to help."
        ];
        let statusIndex = 0;
        setInterval(() => {
            ariaTypingText.style.opacity = '0';
            setTimeout(() => {
                statusIndex = (statusIndex + 1) % statuses.length;
                ariaTypingText.textContent = statuses[statusIndex];
                ariaTypingText.style.opacity = '1';
            }, 300);
        }, 3800);
    }

    // ----------------------------------------------------
    // Hero CTA: "Talk With Aria" Voice Trigger
    // ----------------------------------------------------
    const btnTalkWithAria = document.getElementById('btn-talk-with-aria');
    const heroAriaLips = document.getElementById('hero-aria-lips');

    if (btnTalkWithAria) {
        btnTalkWithAria.addEventListener('click', () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();

                const greetingText = "Hi, I'm Aria from The Code Whiz. I'm your AI business consultant. I help businesses discover smarter ways to automate, build, and grow. How can I help you today?";
                const utterance = new SpeechSynthesisUtterance(greetingText);

                // Select realistic female voice
                const voices = window.speechSynthesis.getVoices();
                const femaleVoice = voices.find(v => 
                    v.name.includes('Zira') || 
                    v.name.includes('Female') || 
                    v.name.includes('Google US English') || 
                    v.name.includes('Samantha') || 
                    v.name.includes('Victoria') || 
                    v.name.includes('Karen') || 
                    v.name.includes('Jenny') || 
                    v.name.includes('Hazel') ||
                    v.name.includes('Aria') ||
                    v.name.includes('Natural')
                );

                if (femaleVoice) utterance.voice = femaleVoice;
                utterance.pitch = 1.22;
                utterance.rate = 0.96;

                // Lip sync pulse during speech
                let lipTimer = setInterval(() => {
                    if (heroAriaLips) {
                        const h = Math.floor(Math.random() * 8) + 3;
                        heroAriaLips.style.height = `${h}px`;
                    }
                }, 110);

                utterance.onend = () => {
                    clearInterval(lipTimer);
                    if (heroAriaLips) heroAriaLips.style.height = '4px';
                };

                window.speechSynthesis.speak(utterance);
            }

            // Smooth scroll to Aria Consultant Engine
            const consultantSec = document.getElementById('consultant');
            if (consultantSec) {
                consultantSec.scrollIntoView({ behavior: 'smooth' });
                const consultantInput = document.getElementById('consultant-user-input');
                if (consultantInput) consultantInput.focus();
            }
        });
    }
});

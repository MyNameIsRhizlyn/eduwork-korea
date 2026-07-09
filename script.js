// FAQ Search and Filter Functionality

const searchInput = document.getElementById('faqSearch');
const categoryChips = document.querySelectorAll('.chip');
const faqFrames = document.querySelectorAll('.frame');
const questionButtons = document.querySelectorAll('.frame-q');

let currentCategory = 'all';

// Search functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    filterFAQ(searchTerm, currentCategory);
});

// Category filter
categoryChips.forEach((chip) => {
    chip.addEventListener('click', () => {
        // Update active state
        categoryChips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        
        // Update aria-pressed
        categoryChips.forEach((c) => c.setAttribute('aria-pressed', 'false'));
        chip.setAttribute('aria-pressed', 'true');
        
        // Update current category and filter
        currentCategory = chip.getAttribute('data-cat');
        filterFAQ(searchInput.value.toLowerCase(), currentCategory);
    });
});

// Filter FAQ based on search term and category
function filterFAQ(searchTerm, category) {
    faqFrames.forEach((frame) => {
        const questionText = frame.querySelector('.frame-text')?.textContent.toLowerCase() || '';
        const answerText = frame.querySelector('.frame-a-inner')?.textContent.toLowerCase() || '';
        const frameCategory = frame.getAttribute('data-cat');
        
        // Check if frame matches category
        const categoryMatch = category === 'all' || frameCategory === category;
        
        // Check if frame matches search term
        const searchMatch = searchTerm === '' || questionText.includes(searchTerm) || answerText.includes(searchTerm);
        
        // Show or hide frame
        if (categoryMatch && searchMatch) {
            frame.classList.remove('hidden');
        } else {
            frame.classList.add('hidden');
            // Close the answer if it's open
            const button = frame.querySelector('.frame-q');
            if (button && button.getAttribute('aria-expanded') === 'true') {
                closeAnswer(button);
            }
        }
    });
}

// Accordion functionality
questionButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        
        // Close all other open answers
        questionButtons.forEach((otherButton) => {
            if (otherButton !== button && otherButton.getAttribute('aria-expanded') === 'true') {
                closeAnswer(otherButton);
            }
        });
        
        // Toggle current answer
        if (isExpanded) {
            closeAnswer(button);
        } else {
            openAnswer(button);
        }
    });
});

function openAnswer(button) {
    const answerId = button.getAttribute('aria-controls');
    const answer = document.getElementById(answerId);
    
    button.setAttribute('aria-expanded', 'true');
    answer.setAttribute('aria-hidden', 'false');
}

function closeAnswer(button) {
    const answerId = button.getAttribute('aria-controls');
    const answer = document.getElementById(answerId);
    
    button.setAttribute('aria-expanded', 'false');
    answer.setAttribute('aria-hidden', 'true');
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close all open answers
        questionButtons.forEach((button) => {
            if (button.getAttribute('aria-expanded') === 'true') {
                closeAnswer(button);
            }
        });
    }
});
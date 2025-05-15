document.addEventListener('DOMContentLoaded', function() {
    console.log('Tutors.js loaded');
    
    const dropdownBtn = document.querySelector('.filter-dropdown-btn');
    const dropdownContent = document.querySelector('.filter-dropdown-content');
    const filterOptions = document.querySelectorAll('.filter-option');
    const tutorCards = document.querySelectorAll('.tutor-card');

    console.log('Dropdown elements:', {
        dropdownBtn: dropdownBtn,
        dropdownContent: dropdownContent,
        filterOptions: filterOptions.length,
        tutorCards: tutorCards.length
    });

    if (!dropdownBtn || !dropdownContent) {
        console.error('Dropdown elements not found');
        return;
    }

    dropdownBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        console.log('Dropdown button clicked');
        dropdownContent.classList.toggle('active');
    });

    document.addEventListener('click', function(event) {
        if (!event.target.closest('.filter-dropdown')) {
            console.log('Clicking outside dropdown');
            dropdownContent.classList.remove('active');
        }
    });

    filterOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const filter = this.dataset.filter;
            console.log('Filter selected:', filter);
            
            filterOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            const buttonText = dropdownBtn.querySelector('span');
            if (buttonText) {
                buttonText.textContent = this.textContent.trim();
            }
            
            tutorCards.forEach(card => {
                const category = card.dataset.category;
                console.log('Card category:', category, 'Filter:', filter);
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            
            dropdownContent.classList.remove('active');
        });
    });
}); 
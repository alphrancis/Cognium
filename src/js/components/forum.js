document.addEventListener('DOMContentLoaded', function() {
    console.log('Forum.js loaded');
    
    const filterButtons = document.querySelectorAll('.btn-filter');
    const forumPosts = document.querySelectorAll('.forum-post');

    console.log('Forum elements:', {
        filterButtons: filterButtons.length,
        forumPosts: forumPosts.length
    });
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            console.log('Selected category:', category);
            
            // Update active state of filter buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter posts
            forumPosts.forEach(post => {
                const postCategory = post.dataset.category;
                console.log('Post category:', postCategory);
                
                if (category === 'all' || postCategory === category) {
                    post.style.display = 'block';
                } else {
                    post.style.display = 'none';
                }
            });
        });
    });

    const actionButtons = document.querySelectorAll('.btn-action');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.classList.contains('btn-like') ? 'like' :
                          this.classList.contains('btn-save') ? 'save' :
                          this.classList.contains('btn-reply') ? 'reply' : null;
            
            if (action) {
                const post = this.closest('.forum-post');
                const postId = post.dataset.postId;
                console.log(`Action: ${action} on post ${postId}`);
                
                if (action === 'like') {
                    this.classList.toggle('active');
                } else if (action === 'save') {
                    this.classList.toggle('active');
                } else if (action === 'reply') {
                    console.log('Reply to post:', postId);
                }
            }
        });
    });
    const newPostButton = document.querySelector('.btn-create');
    if (newPostButton) {
        newPostButton.addEventListener('click', function() {
            console.log('Create new post clicked');
        });
    }
}); 
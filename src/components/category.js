const Category = () => {
    document.addEventListener("DOMContentLoaded", function() {
        const links = document.querySelectorAll('.cate__links li a');
        
        links.forEach(link => {
          link.addEventListener('click', function(event) {
            event.preventDefault(); // 阻止默认的链接行为
      
            // 移除所有链接的 active 类
            links.forEach(link => {
              link.classList.remove('active');
            });
      
            // 将点击的链接添加 active 类
            this.classList.add('active');
          });
        });
      });
    return (
        
            <ul className='cate__links'>
                <li><a href="#" className="active">ALL</a></li>
                <li><a href="#">Text</a></li>
                <li><a href="#">Image</a></li>
                <li><a href="#">Audio</a></li>
                <li><a href="#">Video</a></li>
            </ul>
        
    );
}

export default Category;
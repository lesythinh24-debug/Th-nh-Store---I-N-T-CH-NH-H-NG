$(function () {

  let cartCount = 0;

  function updateCartCount(n) {
    cartCount += n;
    $('#cartCount').text(cartCount).css({ transform:'scale(1.4)' });
    setTimeout(() => $('#cartCount').css({ transform:'scale(1)' }), 250);
  }


  let toastTimer;
  function showToast(msg) {
    clearTimeout(toastTimer);
    $('#toast').text(msg).fadeIn(280);
    toastTimer = setTimeout(() => $('#toast').fadeOut(380), 2600);
  }


  $(document).on('click', '.btn-add-cart', function () {
    const $btn = $(this), name = $btn.data('name');
    $btn.text('✅ Đã thêm!').prop('disabled', true);
    setTimeout(() => $btn.html('🛒 Thêm vào giỏ').prop('disabled', false), 1400);
    updateCartCount(1);
    showToast(`🛒 "${name}" đã được thêm vào giỏ!`);
  });

 
  $(document).on('click', '.quick-view', function () {
    const $c = $(this).closest('.product-card');
    showToast(`👁 Xem nhanh: ${$c.data('name')} — ${Number($c.data('price')).toLocaleString('vi-VN')}₫`);
  });

 
  function filterProducts({ category = null, search = null } = {}) {
    const cat = category || $('[data-filter].active').data('filter') || 'all';
    const q   = search !== null ? search : searchTerm;
    let visible = 0;

    $('#productsGrid .product-card').each(function (i) {
      const $c = $(this);
      const isSale = cat === 'sale';
      const show = ($c.data('name').toLowerCase().includes(q)) &&
                   (isSale ? $c.find('.card-badge.sale').length : (cat === 'all' || $c.data('category') === cat));
      $c[show ? 'fadeIn' : 'hide'](show ? 260 : 0)
        .css({ animationDelay: show ? `${visible * 0.05}s` : '0s' });
      if (show) visible++;
    });

    $('#resultCount').html(`Hiển thị <strong>${visible}</strong> sản phẩm`);
    $('#noResults')[visible ? 'fadeOut' : 'fadeIn'](200);
  }

  $('.nav-link').on('click', function (e) {
    e.preventDefault();
    $('.nav-link').removeClass('active');
    $(this).addClass('active');
    filterProducts({ category: $(this).data('filter') });
  });

 
  let searchTerm = '', debounceTimer;

  function doSearch() {
    searchTerm = $('#searchInput').val().trim().toLowerCase();
    $('.nav-link').removeClass('active');
    $('[data-filter="all"]').addClass('active');
    filterProducts({ search: searchTerm });
  }

  $('#searchBtn').on('click', doSearch);
  $('#searchInput').on('keydown', e => e.key === 'Enter' && doSearch());
  $('#searchInput').on('input', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(doSearch, 350);
  });


  $('#sortSelect').on('change', function () {
    const mode = $(this).val();
    const $grid = $('#productsGrid');
    const cards = $grid.find('.product-card').get().sort((a, b) => {
      const pa = +$(a).data('price'), pb = +$(b).data('price');
      if (mode === 'price-asc')  return pa - pb;
      if (mode === 'price-desc') return pb - pa;
      if (mode === 'name-asc')   return $(a).data('name').localeCompare($(b).data('name'), 'vi');
      return 0;
    });
    $grid.empty();
    $(cards).each((i, el) => $(el).css({ animationDelay:`${i * 0.05}s` }));
    $grid.append(cards);
  });


  $(window).on('scroll', () => $('.header').toggleClass('scrolled', $(window).scrollTop() > 10));
  $('<style>').text('.header.scrolled{box-shadow:0 4px 20px rgba(14,165,233,.18)!important}').appendTo('head');

  
  $('.logo').on('click', () => $('html,body').animate({ scrollTop:0 }, 500));

  
  $('.newsletter-form button').on('click', function () {
    const email = $(this).prev('input').val().trim();
    if (!email || !/\S+@\S+\.\S+/.test(email)) return showToast('⚠️ Vui lòng nhập email hợp lệ!');
    showToast(`✅ Đăng ký thành công: ${email}`);
    $(this).prev('input').val('');
  });


  $('#productsGrid .product-card').each((i, el) => $(el).css('animation-delay', `${i * 0.06}s`));

});
export default {
  bind: function (el, binding) {
    if (!binding.value) {
      el.disabled = true;
      el.style.color = '#bfcbd9';
      el.style.cursor = 'not-allowed';
      el.style.backgroundImage = 'none';
      el.style.backgroundColor = '#eef1f6';
      el.style.borderColor = '#d1dbe5';
    }
  }
}
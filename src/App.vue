<template>
  <button @click="ShowBtn">Click vào đây</button>
</template>

<script>
export default {
  name: "App",
  components: {},
  data() {
    return {
      isShowMessage: false,
      message: "",
      options: {},
    };
  },
  methods: {
    async ShowBtn() {
      // audio warning
      let isDelete = await this.$msgBox.showWarning(
        [
          '<b style="color:red">Bạn có chắc chắn muốn xóa?</b>',
          '<b style="color:red">Bạn có chắc chắn muốn xóa?</b>',
        ].join(" <br> ")
      );
      if (isDelete == "Close") {
        this.$msgBox.showInfo("<b style='color:red'>Đã hủy xóa</b>");
      } else {
        this.$msgBox.showSuccess("<b style='color:green'>Đã xóa thành công</b>");
      }
    },
  },
};
</script>

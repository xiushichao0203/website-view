<script>
export default {
  created() {
    const { params, query } = this.$route
    const { path } = params
    console.log("66666666666666666666")
    this.$router.replace({ path: '/' + path, query })
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>

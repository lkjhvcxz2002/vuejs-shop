  <template>
    <div class="filter-bar ui basic segment grid">
      <div class="ui form">
        <div class="inline field">
          <label>搜尋:</label>
          <input type="text" v-model="filterText" class="three wide column" @keyup="doFilter" placeholder="name, nickname, or email">
          <button class="ui button resetBtn" @click="resetFilter">Reset</button>
        </div>
      </div>
    </div>
  </template>

  <script>
  export default {
    data () {
      return {
        filterText: ''
      }
    },
    methods: {
      doFilter () {
        this.$events.fire('filter-set', this.filterText)
      },
      resetFilter () {
        this.filterText = '';
        this.$events.fire('filter-set', this.filterText)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .resetBtn {
    margin-left: 10px;
  }
</style>
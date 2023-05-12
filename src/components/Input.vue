<template>
  <div>
    <label :for="label">{{ label }}</label>
    <input type="text" v-model="innerValue" :id="label" :placeholder="label" />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      innerValue: this.value,
    };
  },
  watch: {
    value(newValue) {
      if (newValue !== this.innerValue) {
        this.innerValue = newValue;
      }
    },
    innerValue(oldValue, newValue) {
      this.$emit('input', newValue);
      this.$emit('changeValue', oldValue, newValue);
    },
  },
  listeners() {
    return {
      input: event => console.log(event.target.value)
    };
  },
  methods: {

  },
};
</script>

<style scoped>
.input-field {
  position: relative;
}

.input-field input {
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}

.input-field .icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 8px;
}

.error {
  border-color: red;
}

.error-message {
  color: red;
}
</style>

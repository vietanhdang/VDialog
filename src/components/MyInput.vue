<template>
    <div>
        <label>{{ label }}</label>
        <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" :type="type" />
    </div>
</template>
  
<script>
export default {
    props: {
        value: {
            type: String,
            required: true,
        },
        modelValue: {
            type: String,
            default: '',
        },
        label: {
            type: String,
            default: '',
        },
        type: {
            type: String,
            default: 'text',
        },
    },
    computed: {
        computedValue: {
            get() {
                return this.modelValue || this.value;
            },
            set(newValue) {
                this.$emit('update:modelValue', newValue);
            },
        },
    },
};
</script>
  
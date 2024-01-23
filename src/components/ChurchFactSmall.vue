<script setup>

// state
const props = defineProps({
    fact: {},
});

</script>
    
<template>
    <div class="card border-primary mb-3 w-100">
        <div class="card-header text-info">{{ fact.description }}</div>
        <div class="card-body">
            <p class="card-text"> {{ fact.fact }} </p>
        </div>
    </div>
</template>
    
<style scoped>
.make-clickable {
    cursor: pointer;
}

div {
    white-space: pre-wrap;
}
</style>
    
<script setup>

// state
const props = defineProps({
    fact: {},
});

</script>
    
<template>
    <div class="card border-primary mb-3 w-100">
        <div class="card-header text-info">Member Fact</div>
        <div class="card-body">
            <h4 class="card-title">{{ fact.description }}</h4>
            <p class="card-text"> {{ fact.fact }}</p>
        </div>
    </div>
</template>
    
<style scoped>
div {
    white-space: pre-wrap;
}
</style>
    
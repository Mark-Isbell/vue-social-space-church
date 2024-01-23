<script setup>

// state
const props = defineProps({
    link: {},
});

</script>
    
<template>
    <div class="card border-primary mb-3 w-100">
        <div class="card-header text-info">{{ link.description }}</div>
        <div class="card-body">
            <p class="card-text"> <a target="_blank" :href="link.link">{{ link.link }}</a> </p>
        </div>
    </div>
</template>
    
<style scoped>
.make-clickable {
    cursor: pointer;
}
</style>
    
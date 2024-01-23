<script setup>
// imports
import router from "@/router";
import { useChurchStore } from '@/stores/church';

const useChurch = useChurchStore();

function pushToChurchInfo() {
    router.push({ path: '/churchinfo' })
}
function pushToChurchFacts() {
    router.push({ path: '/churchfacts' })
}
function pushToChurchMembers() {
    router.push({ path: '/churchmembers' })
}
function pushToChurchLinks() {
    router.push({ path: '/churchlinks' })
}

function pushToCalendar() {
    var date = new Date();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    useChurch.scrollMonth = month;
    useChurch.scrollYear = year;

    router.push({
        name: "calendar", params: {
            month: month,
            year: year
        }
    });
}

function pushToChurchModeration() {
    router.push({ path: '/churchmoderation' })
}

</script>
    
<template>
    <div class="sidebar sidebar-lg sidebar-fixed sidebar-self-hiding-md d-none d-xl-inline">
        <div class="mt-5">
            <span class="dropdown-item span-link" @click="pushToChurchInfo()">Info
            </span>
            <span class="dropdown-item span-link" @click="pushToChurchFacts()">Facts
            </span>
            <span class="dropdown-item span-link" @click="pushToChurchMembers()">Members
            </span>
            <span class="dropdown-item span-link" @click="pushToChurchLinks()">Links
            </span>
            <span class="dropdown-item span-link" @click="pushToCalendar()">Calendar</span>
            <span class="dropdown-item span-link" @click="pushToChurchModeration()">Moderation Policy</span>
        </div>
    </div>
</template>
    
<style scoped>
.span-link {
    cursor: pointer;
}
</style>
    
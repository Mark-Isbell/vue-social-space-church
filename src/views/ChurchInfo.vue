<script setup>
// imports
import { useChurchStore } from "@/stores/church";
import { ref, onMounted } from "vue";

// state
const useChurch = useChurchStore();

const churchName = ref("");
const churchCountry = ref("");
const churchStreet1 = ref("");
const churchStreet2 = ref("");
const churchCity = ref("");
const churchState = ref("");
const churchZip = ref("");
const churchIntStateProvinceRegion = ref("");
const churchInitZipPostal = ref("");

// dispaly variables
const displayInternational = ref(false);

onMounted(async () => {
    let result = await useChurch.getChurch();
    if (result === true) {
        churchName.value = useChurch.church.name;
        churchCountry.value = useChurch.church.country;
        churchStreet1.value = useChurch.church.street1;
        churchStreet2.value = useChurch.church.street2;
        churchCity.value = useChurch.church.city;
        churchState.value = useChurch.church.state;
        churchZip.value = useChurch.church.zip;
        churchIntStateProvinceRegion.value = useChurch.church.intStateProvinceRegion;
        churchInitZipPostal.value = useChurch.church.intZipPostal;

        if (churchIntStateProvinceRegion.value !== "" || churchInitZipPostal.value !== "") {
            displayInternational.value = true;
        }
        else {
            displayInternational.value = false;
        }
    }
    else {
        // display error message
    }

})

</script>
    
<template>
    <div class="row mt-3">
        <div class="col-3"></div>
        <div class="col-6 h4 text-center">
            Church Info
        </div>
        <div class="col-3"></div>
    </div>

    <div class="row mt-3">
        <div class="col-3"></div>
        <div class="col-6 text-center">
            {{ churchName }}
        </div>
        <div class="col-3"></div>
    </div>

    <div class="row mt-3">
        <div class="col-3"></div>
        <div class="col-6 text-center">
            {{ churchCountry }}
        </div>
        <div class="col-3"></div>
    </div>

    <div class="row mt-2">
        <div class="col-3"></div>
        <div class="col-6 text-center">
            {{ churchStreet1 }}
        </div>
        <div class="col-3"></div>
    </div>

    <div class="row">
        <div class="col-3"></div>
        <div class="col-6 text-center">
            {{ churchStreet2 }}
        </div>
        <div class="col-3"></div>
    </div>

    <div class="row">
        <div class="col-3"></div>
        <div class="col-6 text-center">
            {{ churchCity }}, {{ churchState }} {{ churchZip }}
        </div>
        <div class="col-3"></div>
    </div>

    <div v-show="displayInternational">
        <div class="row">
            <div class="col-3"></div>
            <div class="col-6 text-center">
                {{ churchCity }}, {{ churchIntStateProvinceRegion }} {{ churchInitZipPostal }}
            </div>
            <div class="col-3"></div>
        </div>
    </div>
</template>
    
<style scoped></style>
    
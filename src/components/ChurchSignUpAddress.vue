<script setup >
// imports
import { onMounted, ref } from "vue";
import { useChurchStore } from "@/stores/church";
import { useErrorStore } from "@/stores/error";
const error = useErrorStore();
// example: error.logError("my error string goes here and it will navigate automatically for me")

// state
const useChurch = useChurchStore();

const street1 = ref('');
const street2 = ref('');
const city = ref('');
const state = ref('');
const zip = ref('');
const intStateProvinceRegion = ref('');
const intZipPostal = ref('');
const emit = defineEmits(['addressNext']);

async function saveAddress() {
    useChurch.street1 = street1.value;
    useChurch.street2 = street2.value;
    useChurch.city = city.value;
    useChurch.state = state.value;
    useChurch.zip = zip.value;
    useChurch.intStateProvinceRegion = intStateProvinceRegion.value;
    useChurch.intZipPostal = intZipPostal.value;
    // final check before sending to server
    if (
        useChurch.name !== "" &&
        useChurch.country !== "" &&
        useChurch.street1 === street1.value &&
        useChurch.street2 === street2.value &&
        useChurch.city === city.value &&
        useChurch.state === state.value &&
        useChurch.zip === zip.value &&
        useChurch.intStateProvinceRegion === intStateProvinceRegion.value &&
        useChurch.intZipPostal === intZipPostal.value
    ) {
        // create object to stash in store for later sending by parent component
        let churchReg = {
            name: useChurch.name,
            country: useChurch.country,
            street1: useChurch.street1,
            street2: useChurch.street2,
            city: useChurch.city,
            state: useChurch.state,
            zip: useChurch.zip,
            intStateProvinceRegion: useChurch.intStateProvinceRegion,
            intZipPostal: useChurch.intZipPostal
        }
        useChurch.churchRegistrationObject = churchReg;
        emit('addressNext');
    } else {
        error.logError("problem in church registration in churchsignupaddress component")
    }
}

onMounted(() => {
    // prepopulate with safe store values or updated store values
    street1.value = useChurch.street1
    street2.value = useChurch.street2
    city.value = useChurch.city
    state.value = useChurch.state
    zip.value = useChurch.zip
    intStateProvinceRegion.value = useChurch.intStateProvinceRegion
    intZipPostal.value = useChurch.intZipPostal
})

</script>

<template>
    <div class="row mt-3">
        <div class="col-3"></div>
        <div class="col-6 text-muted em text-center">
            Church Address
        </div>
        <div class="col-3"></div>
    </div>

    <div class="row mt-3">
        <div class="col-6 text-end">Street:</div>
        <div class="col-6"><input v-model="street1" type="text" name="" id=""></div>
    </div>

    <div class="row mt-2">
        <div class="col-6 text-end">Unit #/ suite #:</div>
        <div class="col-6"><input v-model="street2" type="text" name="" id=""></div>
    </div>

    <div class="row mt-2">
        <div class="col-6 text-end">City:</div>
        <div class="col-6"><input v-model="city" type="text" name="" id=""></div>
    </div>

    <div v-show="!useChurch.isInternational">
        <div class="row mt-2">
            <div class="col-6 text-end">State:</div>
            <div class="col-6"><input v-model="state" type="text" name="" id=""></div>
        </div>

        <div class="row mt-2">
            <div class="col-6 text-end">Zip code:</div>
            <div class="col-6"><input v-model="zip" type="text" name="" id=""></div>
        </div>
    </div>

    <div v-show="useChurch.isInternational">
        <div class="row mt-2">
            <div class="col-6 text-end">State/Province/Region:</div>
            <div class="col-6"><input v-model="intStateProvinceRegion" type="text" name="" id=""></div>
        </div>

        <div class="row mt-2">
            <div class="col-6 text-end">Zip or Postal code:</div>
            <div class="col-6"><input v-model="intZipPostal" type="text" name="" id=""></div>
        </div>
    </div>

    <div class="row mt-3 ">
        <div class="col-3"></div>
        <div class="col-6 text-center">
            <button @click="saveAddress()" class="btn btn-primary">Next</button>
        </div>
        <div class="col-3 mb-5"></div>
    </div>
</template>

<style scoped></style>

<script setup>
// imports
import { computed, onMounted, ref } from "vue";
import { useChurchStore } from "@/stores/church";
import { useAuthStore } from "@/stores/auth";

// state
const useChurch = useChurchStore();
const useAuth = useAuthStore();

// edit event variables
const eventId = ref();
const eventTitle = ref("");
const eventDescription = ref("");
const eventBeginDateTime = ref();
const eventEndDateTime = ref();
const eventLocation = ref("");
const eventLink = ref("");

// modal 
// display controls
const editEventModalId = ref();
const showOnlyClose = ref(false);
const showErrorCreatingEvent = ref(false);
const showEventCreateSuccess = ref(false);
const showEventDeletedSuccess = ref(false);
const showEventUpdatedSuccess = ref(false);
const displayValidationFailure = ref(false);
const areEntryFieldsActive = ref(true);
const deleteSelected = ref(false);

const emit = defineEmits(['insertEditedEvent'])

const dataBsTarget = computed(() => {
    return "#" + editEventModalId.value;
})

// validation
const missingString = ref("");

function deleteWasSelected() {
    deleteSelected.value = true;
}

function cancelDeleteWasSelected() {
    deleteSelected.value = false;
}

async function deleteEvent() {

    const result = await useChurch.deleteEvent(eventId.value);
    if (result === true) {
        deleteEventInTilesById(eventId.value)
        // also delete the modal values and deactivate display
        showOnlyClose.value = true;
        // zero out local modal contents as event no longer exists
        deleteModalEventContents();
        showEventDeletedSuccess.value = true;

    } else if (result === false) {
        // some message here
        showOnlyClose.value = true;
    }
}

function deleteModalEventContents() {
    eventId.value = 0;
    eventTitle.value = "";
    eventDescription.value = "";
    eventBeginDateTime.value = null;
    eventEndDateTime.value = null;
    eventLocation.value = "";
    eventLink.value = "";
}

async function saveEdits() {

    resetValidationVariables();

    let eventObject = createEventObject();

    // validate the event content
    let isValidated = validateEventVariables();

    if (isValidated === true) {
        // turn off entry fields now
        areEntryFieldsActive.value = false;
        const result = await useChurch.editEvent(eventObject);
        if (result === true) {
            insertUpdatedEventIntoTiles();
            showEventUpdatedSuccess.value = true;
            showOnlyClose.value = true;
        } else {
            showErrorCreatingEvent.value = true;
            showOnlyClose.value = true;
        }
    } else {
        determineWhatIsMissing();
        displayValidationFailure.value = true;
    }
}

function insertUpdatedEventIntoTiles() {
    // first delete old version in tiles
    deleteEventInTilesById(useChurch.event.id);
    emit('insertEditedEvent');
}

function deleteEventInTilesById(eventId) {
    for (let i = 0; i < useChurch.calendarTiles.length; i++) {
        for (let e = 0; e < useChurch.calendarTiles[i].events.length; e++) {
            if (useChurch.calendarTiles[i].events[e].id = eventId) {
                useChurch.calendarTiles[i].events.splice(e, 1);
            }
        }
    }
}

function resetValidationVariables() {
    showErrorCreatingEvent.value = false;
    displayValidationFailure.value = false;
}

function validateEventVariables() {
    if (eventBeginDateTime.value !== null && eventEndDateTime.value !== null && eventTitle.value !== "") {
        return true;
    } else {
        return false;
    }
}

function createEventObject() {
    return {
        eventId: eventId.value,
        title: eventTitle.value,
        description: eventDescription.value,
        beginDateTime: eventBeginDateTime.value,
        endDateTime: eventEndDateTime.value,
        location: eventLocation.value,
        link: eventLink.value
    }
}

function determineWhatIsMissing() {
    missingString.value = "Please remember to enter: ";
    if (eventBeginDateTime.value === null) {
        missingString.value = missingString.value + "begin date and time ";
    }
    if (eventEndDateTime.value === null) {
        missingString.value = missingString.value + "end date and time ";
    }
    if (eventTitle.value === "") {
        missingString.value = missingString.value + "event title ";
    }
}

function openEditEventDialogue(event) {
    // first copy all event variables to local variables for editing purpose
    copyEventToLocal(event);
    resetModalControls();
}

function resetModalControls() {
    showOnlyClose.value = false;
    showErrorCreatingEvent.value = false;
    showEventCreateSuccess.value = false;
    showEventUpdatedSuccess.value = false;
    showEventDeletedSuccess.value = false;
    displayValidationFailure.value = false;
    areEntryFieldsActive.value = true;
    if (useAuth.member.role !== "moderator") {
        areEntryFieldsActive.value = false;
    }
}

function copyEventToLocal(event) {
    eventId.value = event.id;
    eventTitle.value = event.title;
    eventDescription.value = event.description;
    eventBeginDateTime.value = event.beginDateTime;
    eventEndDateTime.value = event.endDateTime;
    eventLocation.value = event.location;
    eventLink.value = event.link;
}

onMounted(() => {
    // create modal ID for create event modal
    editEventModalId.value = "target" + (Math.floor(Math.random() * 10000000));

    // if member is not a moderator, prevent editing event details
    if (useAuth.member.role !== "moderator") {
        areEntryFieldsActive.value = false;
    }
})

</script>

<template>
    <table class="table table-hover">
        <thead>
            <tr>
                <th class="text-center" scope="col">Sunday</th>
                <th class="text-center" scope="col">Monday</th>
                <th class="text-center" scope="col">Tuesday</th>
                <th class="text-center" scope="col">Wednesday</th>
                <th class="text-center" scope="col">Thursday</th>
                <th class="text-center" scope="col">Friday</th>
                <th class="text-center" scope="col">Saturday</th>
            </tr>
        </thead>
        <tbody>
            <tr class="table-primary">
                <td>
                    <div v-if="useChurch.calendarTiles[0].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">
                            {{ useChurch.calendarTiles[0].dayNumber }}
                        </div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[0].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>

                <td>
                    <div v-if="useChurch.calendarTiles[1].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[1].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[1].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[2].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[2].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[2].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[3].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[3].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[3].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[4].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[4].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[4].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[5].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[5].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[5].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[6].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[6].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[6].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
            <tr class="table-primary">
                <td>
                    <div v-if="useChurch.calendarTiles[7].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[7].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[7].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[8].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[8].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[8].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[9].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[9].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[9].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[10].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[10].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[10].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[11].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[11].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[11].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[12].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[12].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[12].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[13].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[13].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[13].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>

            </tr>
            <tr class="table-primary">
                <td>
                    <div v-if="useChurch.calendarTiles[14].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[14].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[14].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[15].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[15].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[15].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[16].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[16].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[16].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[17].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[17].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[17].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[18].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[18].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[18].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[19].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[19].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[19].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[20].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[20].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[20].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>

            </tr>
            <tr class="table-primary">
                <td>
                    <div v-if="useChurch.calendarTiles[21].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[21].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[21].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[22].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[22].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[22].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[23].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[23].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[23].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[24].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[24].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[24].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[25].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[25].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[25].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[26].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[26].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[26].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[27].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[27].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[27].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
            <tr class="table-primary">
                <td>
                    <div v-if="useChurch.calendarTiles[28].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[28].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[28].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[29].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[29].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[29].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[30].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[30].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[30].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[31].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[31].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[31].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[32].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[32].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[32].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[33].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[33].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[33].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[34].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[34].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[34].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
            <tr class="table-primary" v-if="useChurch.calendarTiles[35].used">
                <td>
                    <div v-if="useChurch.calendarTiles[35].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[35].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[35].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[36].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[36].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[36].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[37].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[37].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[37].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[38].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[38].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[38].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[39].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[39].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[39].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[40].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[40].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[40].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="useChurch.calendarTiles[41].used" class="card border-secondary mb-3"
                        style="max-width: 20 rem;">
                        <div class="card-header text-center text-info">{{ useChurch.calendarTiles[41].dayNumber }}</div>
                        <div class="card-body">

                            <div v-for="event in useChurch.calendarTiles[41].events" :key="event">
                                <p data-bs-toggle="modal" :data-bs-target="dataBsTarget">
                                    <span class="make-clickable" @click="openEditEventDialogue(event)">
                                        {{ event.title }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>

    <!--  modal for editing event -->
    <div :id="editEventModalId" class="modal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Event Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true"></span>
                    </button>
                </div>
                <div class="modal-body">

                    <div class="form-group">
                        <label class="col-form-label" for="title">Event Title</label>
                        <input type="text" class="form-control" v-model="eventTitle" :disabled="!areEntryFieldsActive"
                            placeholder="Event Title (e.g. 'Bible Study Group Meeting')" id="title">
                    </div>

                    <div class="form-group">
                        <label for="details">Event Details:</label>
                        <textarea v-model="eventDescription" class="form-control" id="details" rows="3"
                            :disabled="!areEntryFieldsActive"></textarea>
                    </div>

                    <div class="form-group">
                        <label class="col-form-label" for="beginDateTime">Begin Date and Time</label>
                        <Datepicker v-model="eventBeginDateTime" id="beginDateTime" :disabled="!areEntryFieldsActive">
                        </Datepicker>
                    </div>

                    <div class="form-group">
                        <label class="col-form-label" for="endDateTime">End Date and Time</label>
                        <Datepicker v-model="eventEndDateTime" id="endDateTime" :disabled="!areEntryFieldsActive">
                        </Datepicker>
                    </div>

                    <div class="form-group">
                        <label class="col-form-label" for="location">Event Location</label>
                        <input type="text" class="form-control" v-model="eventLocation" id="location"
                            :disabled="!areEntryFieldsActive">
                    </div>

                    <div class="form-group">
                        <label class="col-form-label" for="link">Event Link</label>
                        <input type="text" class="form-control" v-model="eventLink" id="link"
                            :disabled="!areEntryFieldsActive">
                    </div>
                </div>

                <!-- show only close dynamic footer -->
                <div v-if="!showOnlyClose" class="modal-footer">
                    <div class="me-auto">
                        <div v-show="deleteSelected">
                            <span>
                                <button type="button" class="btn btn-danger me-auto" @click="deleteEvent()">Yes,
                                    Delete</button>
                            </span>
                            <span class="me-2">
                            </span>
                            <span>
                                <button type="button" class="btn btn-danger"
                                    @click="cancelDeleteWasSelected()">Cancel</button>
                            </span>
                        </div>
                        <div v-show="!deleteSelected">
                            <button type="button" class="btn btn-danger" @click="deleteWasSelected()">Delete</button>
                        </div>
                    </div>
                    <button type="button" class="btn btn-primary" @click="saveEdits()">Save Changes</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <div class="text-danger" v-show="showErrorCreatingEvent">
                        Error - changes not saved
                    </div>
                    <div class="text-danger" v-show="displayValidationFailure">
                        {{ missingString }}
                    </div>
                </div>
                <div v-if="showEventDeletedSuccess" class="text-center text-danger">Event deleted!</div>
                <div v-if="showEventUpdatedSuccess" class="text-center text-success">Event updated!</div>
                <div v-if="showEventCreateSuccess" class="text-center text-success">Event created!</div>
                <div v-if="showOnlyClose" class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
                <!-- show only dynamic footer above-->
            </div>
        </div>
    </div>
</template>

<style scoped>
td,
th {
    width: 150px !important;
    max-width: 150px !important;
    min-width: 150px !important;
}

.make-clickable {
    cursor: pointer;
}
</style>

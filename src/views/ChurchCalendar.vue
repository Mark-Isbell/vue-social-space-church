<script setup>
// imports
import { computed, onMounted, ref } from "vue";
import CalendarTiles from "../components/CalendarTiles.vue";
import { useChurchStore } from "@/stores/church";
import { useAuthStore } from "@/stores/auth";
import { useRoute } from 'vue-router'
import router from "@/router";
import { useErrorStore } from "@/stores/error";

const error = useErrorStore();
// example: error.logError("my error string goes here and it will navigate automatically for me")

// state
const route = useRoute();
const useChurch = useChurchStore();
const useAuth = useAuthStore();

// new event variables
const eventTitle = ref("");
const eventDescription = ref("");
const eventBeginDateTime = ref();
const eventEndDateTime = ref();
const eventLocation = ref("");
const eventLink = ref("");

// validation
const missingString = ref("");

// instantiation before render
const tilesInitialized = ref(false); // used to hook up CalendarTiles to dom AFTER initialization

// display parameterized month and year calendar
const year = ref(0);
const month = ref(0);

// for construction of date range for API call - for events
const startYear = ref(0);
const startMonth = ref(0);
const startDay = ref(0);
const endingYear = ref(0);
const endingMonth = ref(0);
const endingDay = ref(0);

// display controls
const memberIsModerator = ref(false);
const createEventModalId = ref();
const showOnlyClose = ref(false);
const showErrorCreatingEvent = ref(false);
const showEventCreateSuccess = ref(false);
const displayValidationFailure = ref(false);
const areEntryFieldsActive = ref(true);

// validation failures
const validationFailures = ref([]);

const dataBsTarget = computed(() => {
    return "#" + createEventModalId.value;
})

function resetNewEventVars() {
    // activate the entry fields if they're not already active
    areEntryFieldsActive.value = true;
    // Reset variables used for display of calendar and events
    resetDisplayVars();
    // Reset variables used for creating new calendar event
    eventTitle.value = "";
    eventDescription.value = "";
    eventBeginDateTime.value = null;
    eventEndDateTime.value = null;
    eventLocation.value = "";
    eventLink.value = "";
}

function resetDisplayVars() {
    showOnlyClose.value = false;
    showErrorCreatingEvent.value = false;
    showEventCreateSuccess.value = false;
    displayValidationFailure.value = false;
}

function resetValidationVariables() {
    showErrorCreatingEvent.value = false;
    displayValidationFailure.value = false;
}

async function createNewEvent() {
    resetValidationVariables();

    let eventObject = createEventObject();

    let isValidated = validateEventVariables();

    if (isValidated === true) {
        // turn off entry fields now
        areEntryFieldsActive.value = false;
        const result = await useChurch.createEvent(eventObject);

        if (result === true) {
            insertNewEventIntoTiles();
            showEventCreateSuccess.value = true;
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

function updateWithEditedEvent() {
    // the updated event is stored in useChurch.event variable, so just call the existing method for 
    // inserting a new event. 
    insertNewEventIntoTiles();
}

function insertNewEventIntoTiles() {


    const firstTileIndex = getFirstUsedTile();
    const lastTileIndex = getLastUsedTile(firstTileIndex);

    // got through each tile in the calendar

    for (let i = firstTileIndex; i < (lastTileIndex + 1); i++) {
        // cast date objects prior to comparison
        let eventBegin = new Date(useChurch.event.beginDateTime);
        let eventEnd = new Date(useChurch.event.endDateTime);
        let rawTileDate = new Date(useChurch.calendarTiles[i].rawDate);

        let rawTileDateBegin = new Date(rawTileDate.setUTCHours(0, 0, 0, 0));
        let rawTileDateEnd = new Date(rawTileDate.setUTCHours(23, 59, 59, 999));

        if (eventBegin <= rawTileDateEnd && eventEnd >= rawTileDateBegin) {

            useChurch.calendarTiles[i].events.push(useChurch.event)
        }
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
    if (validationFailures.value.length > 0) {
        for (let i = 0; i < validationFailures.value.length; i++) {
            missingString.value = missingString.value + " ... and also " + validationFailures.value[i];
        }
    }
}

function validateEventVariables() {
    if (eventBeginDateTime.value !== null && eventEndDateTime.value !== null && eventTitle.value !== "") {
        if (eventEndDateTime.value < eventBeginDateTime.value) {

            validationFailures.value.push("Begin date and time must be before End date and time")
            return false;
        } else {

            return true;
        }
    } else {
        return false;
    }
}

function createEventObject() {
    return {
        title: eventTitle.value,
        description: eventDescription.value,
        beginDateTime: eventBeginDateTime.value,
        endDateTime: eventEndDateTime.value,
        location: eventLocation.value,
        link: eventLink.value
    }
}

function getStringWeekDay(dayInteger) {
    switch (dayInteger) {
        case 0:
            return "Sunday";
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday";
        case 6:
            return "Saturday";
        default:
            return "Error"
    }
}

function assignStartingTile(firstDay) {

    const DayOfWeekNumber = firstDay.getDay(); // returns integer 0-6
    useChurch.calendarTiles[DayOfWeekNumber].used = true;
    useChurch.calendarTiles[DayOfWeekNumber].dayNumber = 1;
    useChurch.calendarTiles[DayOfWeekNumber].dayName = getStringWeekDay(DayOfWeekNumber);
    useChurch.calendarTiles[DayOfWeekNumber].rawDate = firstDay;

    return useChurch.calendarTiles[DayOfWeekNumber].tileNumber; // return the starting tile number
}

function initializeTileArrayWithBlankObjects() {
    for (let i = 0; i < 42; i++) {
        useChurch.calendarTiles.push(
            {
                tileNumber: i + 1,      // position 1-42 in the table: 6 rows of 7 possible days. 
                used: false,            // for display as there WILL be blank tiles in first and last rows.
                dayNumber: 0,           // Can be any integer 1-31 
                dayName: "blank",       // "Monday", "Tuesday", etc...
                rawDate: null,          // date time stamp assigned to the tile
                events: []              // collection of events that overlap or exist on this date/tile
            }
        )
    }
}

function getFirstUsedTile() {
    // used only after tile assignment and before event assignment
    for (let i = 0; i < useChurch.calendarTiles.length; i++) {
        if (useChurch.calendarTiles[i].used === true) {
            return i;
        }
    }
}

function getLastUsedTile(firstTileIndex) {
    for (let j = firstTileIndex; j < useChurch.calendarTiles.length; j++) {
        if (useChurch.calendarTiles[j].used === false) {
            return j;
        }
    }
}

function getMonthName(JS_Month_Index) {
    // to call this, use (JS Date).getMonth()
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return monthNames[JS_Month_Index];
}

function getDateRangeObjectForEventCall() {
    let dateRangeObj = {}
    dateRangeObj.beginMonth = startMonth.value;
    dateRangeObj.beginDay = startDay.value;
    dateRangeObj.beginYear = startYear.value;
    dateRangeObj.endMonth = endingMonth.value;
    dateRangeObj.endDay = endingDay.value;
    dateRangeObj.endYear = endingYear.value;

    return dateRangeObj;
}

function resetTilesInStore() {
    // Reset the calendar variables in the church store
    useChurch.year = 0;
    useChurch.monthNumber = 0;
    useChurch.monthName = "";
    useChurch.week = 0;
    useChurch.dayNumberOfMonth = 0;
    useChurch.calendarTiles = [];
    useChurch.firstUsedTileIndex = 0;
    useChurch.lastUsedTileIndex = 0;
    useChurch.events = [];
    useChurch.event = {};
    useChurch.incrementedDayOfMonth = null;
    useChurch.incrementedDate = null;
    useChurch.lastDayNumberOfMonth = 0;
}

async function scrollBack() {
    // assign new month
    if (useChurch.scrollMonth === 1) {
        useChurch.scrollMonth = 12;
    } else {
        useChurch.scrollMonth = useChurch.scrollMonth - 1;
    }
    // assign new year
    if (useChurch.scrollMonth === 12) {
        useChurch.scrollYear = useChurch.scrollYear - 1;
    }
    router.push({
        name: "calendar", params: {
            month: useChurch.scrollMonth,
            year: useChurch.scrollYear
        }
    });
    month.value = useChurch.scrollMonth;
    year.value = useChurch.scrollYear;
    getCalendarForMonth();
}

async function scrollForward() {

    // assign new month
    if (useChurch.scrollMonth === 12) {
        useChurch.scrollMonth = 1;
    } else {
        useChurch.scrollMonth = useChurch.scrollMonth + 1;
    }
    // assign new year
    if (useChurch.scrollMonth === 1) {
        useChurch.scrollYear = useChurch.scrollYear + 1;
    }
    router.push({
        name: "calendar", params: {
            month: useChurch.scrollMonth,
            year: useChurch.scrollYear
        }
    });
    month.value = useChurch.scrollMonth;
    year.value = useChurch.scrollYear;
    getCalendarForMonth();
}

async function getCalendarForMonth() {

    // First reset tiles in store
    resetTilesInStore();

    // populate the tiles with dates
    // First get an array of all the dates of the current month
    var firstDay = new Date(year.value, month.value - 1, 1);
    var lastDay = new Date(year.value, month.value, 0);
    useChurch.lastDayNumberOfMonth = lastDay.getDate();

    initializeTileArrayWithBlankObjects();
    const firstUsedTile = assignStartingTile(firstDay); // starts at 1

    // now go through the remaining subset of the 42 tiles and populate them.
    // first assign a starting date that will be incremented with each loop
    for (let j = firstUsedTile; j < 42; j++) {
        useChurch.incrementedDate = new Date(firstDay);
        useChurch.incrementedDate.setDate(firstDay.getDate() + (j - (firstUsedTile - 1)));
        // For each tile, assign the dates, days, and numbers
        useChurch.calendarTiles[j].used = true;
        useChurch.incrementedDayOfMonth = useChurch.incrementedDate.getDate();
        useChurch.calendarTiles[j].dayNumber = useChurch.incrementedDayOfMonth;
        let localDayOfWeekNumber = useChurch.incrementedDate.getDay(); // returns integer 0-6
        useChurch.calendarTiles[j].dayName = getStringWeekDay(localDayOfWeekNumber);
        useChurch.calendarTiles[j].rawDate = useChurch.incrementedDate;
        if (useChurch.lastDayNumberOfMonth === useChurch.calendarTiles[j].dayNumber) {
            break;
        }
    }

    // assign month name for display
    useChurch.monthName = getMonthName(firstDay.getMonth());
    // assign year for display
    useChurch.year = firstDay.getFullYear();

    // after all tiles are configured, get events for current month
    // assign variable values for the date range object

    startYear.value = firstDay.getFullYear();
    startMonth.value = firstDay.getMonth() + 1;
    startDay.value = firstDay.getDate();

    endingYear.value = lastDay.getFullYear();
    endingMonth.value = lastDay.getMonth() + 1;
    endingDay.value = lastDay.getDate();

    // construct date range object
    let rangeObject = getDateRangeObjectForEventCall()

    // get events for month
    await useChurch.getEvents(rangeObject);

    // loop through each calendar day tile and assign events to event array for that tile
    // for loop should only loop through USED tiles to keep it efficient
    // so get the tile index for the first used tile and last used tile
    const firstTileIndex = getFirstUsedTile();
    const lastTileIndex = getLastUsedTile(firstTileIndex);

    for (let i = firstTileIndex; i < (lastTileIndex + 1); i++) {
        // loop for each calendar tile
        for (let j = 0; j < useChurch.events.length; j++) {
            // loop for each event

            // cast date objects prior to comparison
            let eventBegin = new Date(useChurch.events[j].beginDateTime);
            let eventEnd = new Date(useChurch.events[j].endDateTime);
            let rawTileDate = new Date(useChurch.calendarTiles[i].rawDate);

            let rawTileDateBegin = new Date(rawTileDate.setUTCHours(0, 0, 0, 0));
            let rawTileDateEnd = new Date(rawTileDate.setUTCHours(23, 59, 59, 999));

            if (eventBegin <= rawTileDateEnd && eventEnd >= rawTileDateBegin) {

                useChurch.calendarTiles[i].events.push(useChurch.events[j])
            }

        }
    }

    // activate render and display of calendar
    tilesInitialized.value = true;

    // if member is a moderator, provide the option for creating a new event
    if (useAuth.member.role === "moderator") {
        memberIsModerator.value = true;
    }
}

onMounted(async () => {
    // assign local month and year from the parameters
    month.value = Number(route.params.month);
    year.value = Number(route.params.year);

    // Top nav assigns these as well, but just in case person hits refresh on calendar view
    useChurch.scrollMonth = month.value;
    useChurch.scrollYear = year.value;

    // create modal ID for create event modal
    createEventModalId.value = "target" + Math.floor(Math.random() * 10000000);

    // call to populate month
    getCalendarForMonth();
})

</script>

<template>
    <div class="row mt-3">
        <div class="col-3"></div>
        <div class="col-6 h4 text-center">
            Calendar
        </div>
        <div class="col-3"></div>
    </div>

    <div v-if="memberIsModerator">

        <button type="button" class="btn btn-primary" data-bs-toggle="modal" :data-bs-target="dataBsTarget" title="Report"
            alt="Report" @click="resetNewEventVars()"> + New Event
        </button>

    </div>

    <div class="row">
        <div class="col-3"></div>
        <div class="col-6 mt-2 text-center">
            <button type="button" class="me-2 btn btn-primary" @click="scrollBack()">⬅
            </button>
            <span class="h4 me-2">{{ useChurch.monthName }}</span><span class="h4">{{ useChurch.year }}</span>
            <button type="button" class="ms-2 btn btn-primary" @click="scrollForward()">➡
            </button>
        </div>
        <div class="col-3"></div>
    </div>

    <div v-if="tilesInitialized">
        <CalendarTiles @insertEditedEvent="updateWithEditedEvent()">

        </CalendarTiles>
    </div>

    <!--  modal for creating new event -->
    <div :id="createEventModalId" class="modal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Create New Event</h5>
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
                        <input type="text" class="form-control" v-model="eventLocation"
                            placeholder="Physical or virtual location of meeting" id="location"
                            :disabled="!areEntryFieldsActive">
                    </div>

                    <div class="form-group">
                        <label class="col-form-label" for="link">Event Link</label>
                        <input type="text" class="form-control" v-model="eventLink"
                            placeholder="Link to virtual information or meeting" id="link"
                            :disabled="!areEntryFieldsActive">
                    </div>

                </div>
                <div v-if="!showOnlyClose" class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="createNewEvent()">Create Event</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <div class="text-danger" v-show="showErrorCreatingEvent">
                        Error creating event
                    </div>
                    <div class="text-danger" v-show="displayValidationFailure">
                        {{ missingString }}
                    </div>
                </div>
                <div v-if="showOnlyClose" class="modal-footer">
                    <div class="text-success">Event created!</div>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>

<script setup>
// imports
import { onMounted, ref, watch } from "vue";
import { useChurchStore } from "@/stores/church";

// state
const useChurch = useChurchStore();
const showUpdateUI = ref(false);
const activeOrNot = ref(true);
const errorList = ref([]);
const showSuccessMessage = ref(false);

// watchers
watch(() => useChurch.updateCountry, (n) => {
    // if path is private page and user logs out then nav to -> login
    if (n !== "United States") {
        useChurch.updateZip = useChurch.church.zip;
        useChurch.updateState = useChurch.church.state;
        useChurch.updateIsInternational = true;
    } else {
        useChurch.updateIntZipPostal = useChurch.church.intZipPostal;
        useChurch.updateIntStateProvinceRegion = useChurch.church.intStateProvinceRegion;
        useChurch.updateIsInternational = false
    }
})

function assignValuesToUpdateVars() {
    useChurch.updateName = useChurch.church.name;
    useChurch.updateCountry = useChurch.church.country;
    useChurch.updateStreet1 = useChurch.church.street1;
    useChurch.updateStreet2 = useChurch.church.street2;
    useChurch.updateCity = useChurch.church.city;
    useChurch.updateState = useChurch.church.state;
    useChurch.updateZip = useChurch.church.zip;
    useChurch.updateIntStateProvinceRegion = useChurch.church.intStateProvinceRegion;
    useChurch.updateIntZipPostal = useChurch.church.intZipPostal;
}

async function validateAndUpdate() {
    errorList.value = [];
    showSuccessMessage.value = false;
    activeOrNot.value = false;
    const updatedChurchObject = getChurchObject();
    let isValidated = validateChurchObject(updatedChurchObject);
    if (isValidated) {
        const result = await useChurch.updateChurch(updatedChurchObject);
        if (result === true) {
            resetVariables();
            activeOrNot.value = true;
            showSuccessMessage.value = true;
        } else {
            errorList.value.push("Problem encountered updating church")
            // don't reset variables - allow them to hit Update button again just in case
        }
    }
    else {
        // moderator must fix issues and re-try
        activeOrNot.value = true;
    }
}

function validateChurchObject(updatedChurchObject) {
    let validationResult = true;
    // depending on international flag, inspect for non-blank values
    if (useChurch.updateIsInternational === true) {
        if (updatedChurchObject.intStateProvinceRegion === "" || updatedChurchObject.intZipPostal === "") {
            errorList.value.push("Both region and postal code must contain a value");
            validationResult = false;
        }
    }
    else {
        if (updatedChurchObject.state === "" || updatedChurchObject.zip === "") {
            errorList.value.push("Both state and zip code must contain a value");
            validationResult = false;
        }
    }
    return validationResult;
}

function resetVariables() {
    assignValuesToUpdateVars();
    if (useChurch.updateIntStateProvinceRegion !== "") {
        useChurch.updateIsInternational = true;
    } else {
        useChurch.updateIsInternational = false;
    }
    showUpdateUI.value = true;
}

function getChurchObject() {
    let churchObj = {
        name: useChurch.updateName,
        country: useChurch.updateCountry,
        street1: useChurch.updateStreet1,
        street2: useChurch.updateStreet2,
        city: useChurch.updateCity,
    }
    // depending on international flag, assign blank values
    if (useChurch.updateIsInternational === true) {
        churchObj.intStateProvinceRegion = useChurch.updateIntStateProvinceRegion;
        churchObj.intZipPostal = useChurch.updateIntZipPostal;
        churchObj.state = "";
        churchObj.zip = "";
    }
    else {
        churchObj.intStateProvinceRegion = "";
        churchObj.intZipPostal = "";
        churchObj.state = useChurch.updateState;
        churchObj.zip = useChurch.updateZip;
    }
    return churchObj;
}

onMounted(async () => {
    // get latest version of church then copy to update variables 
    await useChurch.getChurch();
    assignValuesToUpdateVars();
    if (useChurch.updateIntStateProvinceRegion !== "") {
        useChurch.updateIsInternational = true;
    } else {
        useChurch.updateIsInternational = false;
    }
    showUpdateUI.value = true;
})

</script>
    
<template>
    <div class="row mt-3">
        <div class="col-3"></div>
        <div class="col-6 h4 text-center">
            Update Church Information
        </div>
        <div class="col-3"></div>
    </div>

    <div class="row mt-3">
        <div class="col-6 text-end">Church name:</div>
        <div class="col-6"><input v-model="useChurch.updateName" type="text" name="" id=""></div>
    </div>

    <div class="row mt-4">
        <div class="col-6 text-end">Church country location:</div>
        <div class="col-6">
            <select v-model="useChurch.updateCountry" name="country" id="country" class="county">
                <option selected value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="Albania">Albania</option>
                <option value="Algeria">Algeria</option>
                <option value="American Samoa">American Samoa</option>
                <option value="Andorra">Andorra</option>
                <option value="Angola">Angola</option>
                <option value="Anguilla">Anguilla</option>
                <option value="Antarctica">Antarctica</option>
                <option value="Antigua">Antigua</option>
                <option value="Argentina">Argentina</option>
                <option value="Armenia">Armenia</option>
                <option value="Aruba">Aruba</option>
                <option value="Australia">Australia</option>
                <option value="Austria">Austria</option>
                <option value="Azerbaijani">Azerbaijani</option>
                <option value="Bahamas">Bahamas</option>
                <option value="Bahrain">Bahrain</option>
                <option value="Bangladesh">Bangladesh</option>
                <option value="Barbados">Barbados</option>
                <option value="Belarus">Belarus</option>
                <option value="Belgium">Belgium</option>
                <option value="Belize">Belize</option>
                <option value="Benin">Benin</option>
                <option value="Bermuda">Bermuda</option>
                <option value="Bhutan">Bhutan</option>
                <option value="Bolivia">Bolivia</option>
                <option value="Bosnia-Hercegovina">Bosnia-Hercegovina</option>
                <option value="Botswana">Botswana</option>
                <option value="Bouvet Island">Bouvet Island</option>
                <option value="Brazil">Brazil</option>
                <option value="British IOT">British IOT</option>
                <option value="Brunei Darussalam">Brunei Darussalam</option>
                <option value="Bulgaria">Bulgaria</option>
                <option value="Burkina Faso">Burkina Faso</option>
                <option value="Burundi">Burundi</option>
                <option value="Cambodia">Cambodia</option>
                <option value="Cameroon">Cameroon</option>
                <option value="Cape Verde">Cape Verde</option>
                <option value="Cayman Islands">Cayman Islands</option>
                <option value="Central African Rep">Central African Rep</option>
                <option value="Chad">Chad</option>
                <option value="Chile">Chile</option>
                <option value="China">China</option>
                <option value="Christmas Island">Christmas Island</option>
                <option value="Cocos Islands">Cocos Islands</option>
                <option value="Colombia">Colombia</option>
                <option value="Comoros">Comoros</option>
                <option value="Congo">Congo</option>
                <option value="Cook Islands">Cook Islands</option>
                <option value="Costa Rica">Costa Rica</option>
                <option value="Croatia">Croatia</option>
                <option value="Cyprus">Cyprus</option>
                <option value="Czech Republic">Czech Republic</option>
                <option value="Denmark">Denmark</option>
                <option value="Djibouti">Djibouti</option>
                <option value="Dominica">Dominica</option>
                <option value="Dominican Republic">Dominican Republic</option>
                <option value="East Timor">East Timor</option>
                <option value="Ecuador">Ecuador</option>
                <option value="Egypt">Egypt</option>
                <option value="El Salvador">El Salvador</option>
                <option value="Equatorial Guinea">Equatorial Guinea</option>
                <option value="Eritrea">Eritrea</option>
                <option value="Estonia">Estonia</option>
                <option value="Ethiopia">Ethiopia</option>
                <option value="Faeroe Islands">Faeroe Islands</option>
                <option value="Falkland Islands">Falkland Islands</option>
                <option value="Fiji">Fiji</option>
                <option value="Finland">Finland</option>
                <option value="France">France</option>
                <option value="French Guiana">French Guiana</option>
                <option value="French Polynesia">French Polynesia</option>
                <option value="French Southern">French Southern</option>
                <option value="French Southern Ter">French Southern Ter</option>
                <option value="Gabon">Gabon</option>
                <option value="Gambia">Gambia</option>
                <option value="Georgia">Georgia</option>
                <option value="Germany">Germany</option>
                <option value="Ghana">Ghana</option>
                <option value="Gibraltar">Gibraltar</option>
                <option value="Greece">Greece</option>
                <option value="Greenland">Greenland</option>
                <option value="Grenada">Grenada</option>
                <option value="Guadeloupe">Guadeloupe</option>
                <option value="Guam">Guam</option>
                <option value="Guatemala">Guatemala</option>
                <option value="Guinea">Guinea</option>
                <option value="Guinea-Bissau">Guinea-Bissau</option>
                <option value="Guyana">Guyana</option>
                <option value="Haiti">Haiti</option>
                <option value="Heard">Heard</option>
                <option value="Honduras">Honduras</option>
                <option value="Hong Kong">Hong Kong</option>
                <option value="Hungary">Hungary</option>
                <option value="Iceland">Iceland</option>
                <option value="India">India</option>
                <option value="Indonesia">Indonesia</option>
                <option value="Ireland">Ireland</option>
                <option value="Israel">Israel</option>
                <option value="Italy">Italy</option>
                <option value="Ivory Coast">Ivory Coast</option>
                <option value="Jamaica">Jamaica</option>
                <option value="Japan">Japan</option>
                <option value="Jordan">Jordan</option>
                <option value="Kazakhstan">Kazakhstan</option>
                <option value="Kenya">Kenya</option>
                <option value="Kiribati">Kiribati</option>
                <option value="Kuwait">Kuwait</option>
                <option value="Kyrgyzstan">Kyrgyzstan</option>
                <option value="Laos">Laos</option>
                <option value="Latvia">Latvia</option>
                <option value="Lebanon">Lebanon</option>
                <option value="Lesotho">Lesotho</option>
                <option value="Liberia">Liberia</option>
                <option value="Liechtenstein">Liechtenstein</option>
                <option value="Lithuania">Lithuania</option>
                <option value="Luxembourg">Luxembourg</option>
                <option value="Macau">Macau</option>
                <option value="Macedonia">Macedonia</option>
                <option value="Madagascar">Madagascar</option>
                <option value="Malawi">Malawi</option>
                <option value="Malaysia">Malaysia</option>
                <option value="Maldives">Maldives</option>
                <option value="Mali">Mali</option>
                <option value="Malta">Malta</option>
                <option value="Marshall Islands">Marshall Islands</option>
                <option value="Martinique">Martinique</option>
                <option value="Mauritania">Mauritania</option>
                <option value="Mauritius">Mauritius</option>
                <option value="Mayotte">Mayotte</option>
                <option value="Mexico">Mexico</option>
                <option value="Micronesia">Micronesia</option>
                <option value="MNP">MNP</option>
                <option value="Moldova">Moldova</option>
                <option value="Monaco">Monaco</option>
                <option value="Mongolia">Mongolia</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Morocco">Morocco</option>
                <option value="Mozambique">Mozambique</option>
                <option value="Myanmar">Myanmar</option>
                <option value="Namibia">Namibia</option>
                <option value="Nauru">Nauru</option>
                <option value="Nepal">Nepal</option>
                <option value="NER">NER</option>
                <option value="Netherlands">Netherlands</option>
                <option value="Neutral Zone">Neutral Zone</option>
                <option value="New Caledonia">New Caledonia</option>
                <option value="New Zealand">New Zealand</option>
                <option value="Nicaragua">Nicaragua</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Niue">Niue</option>
                <option value="Norfolk Island">Norfolk Island</option>
                <option value="North Korea">North Korea</option>
                <option value="Norway">Norway</option>
                <option value="Oman">Oman</option>
                <option value="Pakistan">Pakistan</option>
                <option value="Palau">Palau</option>
                <option value="Panama">Panama</option>
                <option value="Papua New Guinea">Papua New Guinea</option>
                <option value="Paraguay">Paraguay</option>
                <option value="Peru">Peru</option>
                <option value="Philippines">Philippines</option>
                <option value="Pitcairn">Pitcairn</option>
                <option value="Poland">Poland</option>
                <option value="Portugal">Portugal</option>
                <option value="Puerto Rico">Puerto Rico</option>
                <option value="Qatar">Qatar</option>
                <option value="Reunion">Reunion</option>
                <option value="Romania">Romania</option>
                <option value="Russia">Russia</option>
                <option value="Rwanda">Rwanda</option>
                <option value="Saint Helena">Saint Helena</option>
                <option value="Saint Lucia">Saint Lucia</option>
                <option value="Saint Pierre">Saint Pierre</option>
                <option value="Saint Vincent">Saint Vincent</option>
                <option value="Samoa">Samoa</option>
                <option value="San Marino">San Marino</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="Scotland">Scotland</option>
                <option value="Senegal">Senegal</option>
                <option value="Seychelles">Seychelles</option>
                <option value="Sierra Leone">Sierra Leone</option>
                <option value="Singapore">Singapore</option>
                <option value="Slovak Republic">Slovak Republic</option>
                <option value="Slovenia">Slovenia</option>
                <option value="Solomon Islands">Solomon Islands</option>
                <option value="Somali Democratic">Somali Democratic</option>
                <option value="South Africa">South Africa</option>
                <option value="South Georgia">South Georgia</option>
                <option value="South Korea">South Korea</option>
                <option value="Spain">Spain</option>
                <option value="Sri Lanka">Sri Lanka</option>
                <option value="St. Kitts and Nevis">St. Kitts and Nevis</option>
                <option value="STP">STP</option>
                <option value="Suriname">Suriname</option>
                <option value="Svalbard">Svalbard</option>
                <option value="Swaziland">Swaziland</option>
                <option value="Sweden">Sweden</option>
                <option value="Switzerland">Switzerland</option>
                <option value="Syria">Syria</option>
                <option value="Taiwan">Taiwan</option>
                <option value="Tajikistan">Tajikistan</option>
                <option value="Tanzania">Tanzania</option>
                <option value="TCA">TCA</option>
                <option value="Thailand">Thailand</option>
                <option value="Toga">Toga</option>
                <option value="Togolese">Togolese</option>
                <option value="Tokelau">Tokelau</option>
                <option value="Tongo">Tongo</option>
                <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                <option value="Tunisia">Tunisia</option>
                <option value="Turkey">Turkey</option>
                <option value="Turkmenistan">Turkmenistan</option>
                <option value="Tuvalu">Tuvalu</option>
                <option value="Uganda">Uganda</option>
                <option value="Ukraine">Ukraine</option>
                <option value="United Arab">United Arab</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Upper Volta">Upper Volta</option>
                <option value="Uruguay">Uruguay</option>
                <option value="USSR(Former)">USSR(Former)</option>
                <option value="Uzbekistan">Uzbekistan</option>
                <option value="Vanuatu">Vanuatu</option>
                <option value="Vatican City">Vatican City</option>
                <option value="Venezuela">Venezuela</option>
                <option value="VI, British">VI, British</option>
                <option value="Viet Nam">Viet Nam</option>
                <option value="Virgin Islands, USA">Virgin Islands, USA</option>
                <option value="Western Sahara">Western Sahara</option>
                <option value="WLF">WLF</option>
                <option value="Yemen">Yemen</option>
                <option value="Yugoslavia">Yugoslavia</option>
                <option value="Zaire">Zaire</option>
                <option value="Zambia">Zambia</option>
                <option value="Zimbabwe">Zimbabwe</option>
            </select>
        </div>
    </div>



    <div class="row mt-3">
        <div class="col-3"></div>
        <div class="col-6 text-muted em text-center">
            Church Address
        </div>
        <div class="col-3"></div>
    </div>

    <div class="row mt-3">
        <div class="col-6 text-end">Street:</div>
        <div class="col-6"><input v-model="useChurch.updateStreet1" type="text" name="" id=""></div>
    </div>

    <div class="row mt-2">
        <div class="col-6 text-end">Unit #/ suite #:</div>
        <div class="col-6"><input v-model="useChurch.updateStreet2" type="text" name="" id=""></div>
    </div>

    <div class="row mt-2">
        <div class="col-6 text-end">City:</div>
        <div class="col-6"><input v-model="useChurch.updateCity" type="text" name="" id=""></div>
    </div>

    <div v-show="!useChurch.updateIsInternational">
        <div class="row mt-4">
            <div class="col-6 text-end">State:</div>
            <div class="col-6">
                <select v-model="useChurch.updateState" name="state" id="state" class="state">
                    <option selected value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AS">American Samoa</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="UM-81">Baker Island</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="DC">District of Columbia</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="GU">Guam</option>
                    <option value="HI">Hawaii</option>
                    <option value="UM-84">Howland Island</option>
                    <option value="ID">Idaho</option>
                    <option value="IL">Illinois</option>
                    <option value="IN">Indiana</option>
                    <option value="IA">Iowa</option>
                    <option value="UM-86">Jarvis Island</option>
                    <option value="UM-67">Johnston Atoll</option>
                    <option value="KS">Kansas</option>
                    <option value="KY">Kentucky</option>
                    <option value="UM-89">Kingman Reef</option>
                    <option value="LA">Louisiana</option>
                    <option value="ME">Maine</option>
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MI">Michigan</option>
                    <option value="UM-71">Midway Atoll</option>
                    <option value="MN">Minnesota</option>
                    <option value="MS">Mississippi</option>
                    <option value="MO">Missouri</option>
                    <option value="MT">Montana</option>
                    <option value="UM-76">Navassa Island</option>
                    <option value="NE">Nebraska</option>
                    <option value="NV">Nevada</option>
                    <option value="NH">New Hampshire</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NM">New Mexico</option>
                    <option value="NY">New York</option>
                    <option value="NC">North Carolina</option>
                    <option value="ND">North Dakota</option>
                    <option value="MP">Northern Mariana Islands</option>
                    <option value="OH">Ohio</option>
                    <option value="OK">Oklahoma</option>
                    <option value="OR">Oregon</option>
                    <option value="UM-95">Palmyra Atoll</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="PR">Puerto Rico</option>
                    <option value="RI">Rhode Island</option>
                    <option value="SC">South Carolina</option>
                    <option value="SD">South Dakota</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                    <option value="UM">United States Minor Outlying Islands</option>
                    <option value="VI">United States Virgin Islands</option>
                    <option value="UT">Utah</option>
                    <option value="VT">Vermont</option>
                    <option value="VA">Virginia</option>
                    <option value="UM-79">Wake Island</option>
                    <option value="WA">Washington</option>
                    <option value="WV">West Virginia</option>
                    <option value="WI">Wisconsin</option>
                    <option value="WY">Wyoming</option>
                </select>
            </div>
        </div>

        <div class="row mt-2">
            <div class="col-6 text-end">Zip code:</div>
            <div class="col-6"><input v-model="useChurch.updateZip" type="text" name="" id=""></div>
        </div>
    </div>

    <div v-show="useChurch.updateIsInternational">
        <div class="row mt-2">
            <div class="col-6 text-end">State/Province/Region:</div>
            <div class="col-6"><input v-model="useChurch.updateIntStateProvinceRegion" type="text" name="" id=""></div>
        </div>

        <div class="row mt-2">
            <div class="col-6 text-end">Zip or Postal code:</div>
            <div class="col-6"><input v-model="useChurch.updateIntZipPostal" type="text" name="" id=""></div>
        </div>
    </div>

    <div class="row mt-4">
        <div class="col-3"></div>
        <div class="col-6 text-center">
            <button :disabled="!activeOrNot" class="btn btn-primary" @click="validateAndUpdate()">Update Church</button>
        </div>
        <div class="col-3"></div>
    </div>


    <div class="row mt-3 mb-1">
        <div class="col-4"></div>
        <div class="col-6">
            <div class="text-danger" v-for="errorMessage in errorList" :key="errorMessage">
                {{ errorMessage }}
            </div>
        </div>
        <div class="col-2"></div>
    </div>

    <div v-show="showSuccessMessage" class="row mt-3 mb-1">
        <div class="col-4"></div>
        <div class="col-6">
            <div class="text-success">
                Church information successfully updated!
            </div>
        </div>
        <div class="col-2"></div>
    </div>
</template>
    
<style scoped></style>
    
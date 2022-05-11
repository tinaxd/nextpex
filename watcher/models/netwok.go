package models

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"time"
)

func GetApexStats(api_endpoint string, api_key string, platform string, uid string) *ApexStats {
	request, err := http.NewRequest("GET", api_endpoint+"/standard/profile/"+platform+"/"+uid, nil)
	if err != nil {
		log.Fatal(err)
	}

	// Set GET params
	params := request.URL.Query()
	params.Set("TRN-Api-Key", api_key)
	request.URL.RawQuery = params.Encode()

	// Set timeouts to 5s
	client := &http.Client{
		Timeout: 10 * time.Second,
	}

	// Send request
	response, err := client.Do(request)
	if err != nil {
		log.Fatal(err)
	}

	defer response.Body.Close()

	// Read body data
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Fatal(err)
	}

	// Get specific stats
	apexStats := ApexStats{}
	jsonErr := json.Unmarshal(body, &apexStats)
	if jsonErr != nil {
		log.Fatal(jsonErr)
	}

	// Validate response data
	if len(apexStats.Data.Segments) == 0 {
		return nil
	}

	// Delete surplus data
	apexStats.Data.Segments = apexStats.Data.Segments[:1]

	return &apexStats
}

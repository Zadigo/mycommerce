package handlers

import (
	"bytes"
	"net/http"
)

type JsonResponse struct {
	Message map[string]string
}

func (j *JsonResponse) Encode(r http.ResponseWriter, data string) {
	bytes.NewBuffer([]byte(data)).WriteTo(r)
	r.WriteHeader(http.StatusOK)
}

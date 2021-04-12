package main

import (
	"fmt"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/rekognition"
	"strings"
)


func newRekognitionImpl() *rekognitionImpl{
	sess := session.Must(session.NewSession())
	svc := rekognition.New(sess)
	return &rekognitionImpl{
		client: svc,
	}
}

type rekognitionImpl struct {
	client *rekognition.Rekognition
}

func (r *rekognitionImpl) doesLabelMatch(image []byte, label string) (bool, error){
	input := &rekognition.DetectLabelsInput{
		Image: &rekognition.Image{
			Bytes: image,
		},
		MaxLabels: aws.Int64(10),
		MinConfidence: aws.Float64(70.0),
	}
	response, err := r.client.DetectLabels(input)
	if err != nil {
		return false, fmt.Errorf("error in detect label call %v", err)
	}
	label = strings.ToLower(strings.ReplaceAll(label, " ", ""))
	for _, l := range response.Labels{
		thisLabel := strings.ToLower(strings.ReplaceAll(*l.Name, " ", ""))
		if thisLabel == label {
			return true, nil
		}
	}
	return false, nil
}


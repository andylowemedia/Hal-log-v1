#!/usr/bin/env bash

QUEUE_COUNT="`aws sqs get-queue-attributes --queue-url https://sqs.eu-west-1.amazonaws.com/540688370389/the-hal-project-v2-job-queue --attribute-names ApproximateNumberOfMessages | grep -Eo '[0-9]{1,4}'`"
WORKERS=$(( (QUEUE_COUNT / 100) + 2 ));

#if [[ (${QUEUE_COUNT} > 0) && (${WORKERS} -eq "0") ]]; then
#    WORKERS=2
#fi

if [[ ${QUEUE_COUNT} -eq "0" ]]; then
    WORKERS=0
fi

INSTANCES=$(( WORKERS / 2 ));
echo "Queue Count: $QUEUE_COUNT"
echo "No of Instanes Needed: $INSTANCES"
echo "No of Container Workers Needed: $WORKERS"

#Update autoscaling groups, change instances and container that are running
aws autoscaling set-desired-capacity --auto-scaling-group-name EC2ContainerService-Hal-scraper-EcsInstanceAsg-1X15G7PROHW1E --desired-capacity $INSTANCES --honor-cooldown
aws ecs update-service --cluster Hal-scraper --service Hal-scraper-v3 --desired-count $WORKERS > /dev/null

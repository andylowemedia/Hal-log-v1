#!groovy
properties([[$class: 'JiraProjectProperty'], disableConcurrentBuilds(), pipelineTriggers([[$class: 'PeriodicFolderTrigger', interval: '10m']])])


node {
        stage ('Building Environment') {
            try {
                checkout scm
                sh "sed -i \"s/#{TAG_NAME}#/${env.TAG_NAME}/\" docker-compose.jenkins.yml"
                sh "sed -i \"s/#{BUILD_NAME}#/${currentBuild.number}/\" docker-compose.jenkins.yml"

                sh "docker network create halv2_log-default-${env.TAG_NAME}-build-${currentBuild.number}"
                sh 'docker-compose -f docker-compose.jenkins.yml build --no-cache && docker-compose -f docker-compose.jenkins.yml up -d'
                sleep(480)
                sh "docker exec hal-message-broker-node-app-${env.TAG_NAME}-build-${currentBuild.number} composer development-enable"
            } catch (err) {
                sh 'docker-compose -f docker-compose.jenkins.yml down -v'
                sh "docker network rm halv2_event-broker-default-${env.TAG_NAME}-build-${currentBuild.number}"
                sh "rm -rf *"
                sh "rm -rf .git .gitignore"
                sh "docker system prune -f"
                throw err
            }

        }
        stage ('Testing: TDD Tests') {
            try {
                sh "find src/ -name \"*.js\" -type f -delete"
                sh "docker exec hal-log-node-app-${env.TAG_NAME}-build-${currentBuild.number} ./node_modules/.bin/jest ./__tests__/TDD/ --coverage"
                step([
                    $class: 'CloverPublisher',
                    cloverReportDir: 'node-app/coverage',
                    cloverReportFileName: 'clover.xml',
                    healthyTarget: [methodCoverage: 100, conditionalCoverage: 100, statementCoverage: 100],
                    unhealthyTarget: [methodCoverage: 99, conditionalCoverage: 99, statementCoverage: 99],
                    failingTarget: [methodCoverage: 99, conditionalCoverage: 99, statementCoverage: 99]
                ])
            } catch (err) {
                sh 'docker-compose -f docker-compose.jenkins.yml down -v'
                sh "docker network rm halv2_log-default-${env.TAG_NAME}-build-${currentBuild.number}"
                sh "rm -rf *"
                sh "rm -rf .git .gitignore"
                sh "docker system prune -f"
                throw err
            }
        }
        stage ('Testing: BDD Tests') {
            try {
                sh "docker exec hal-message-broker-node-app-${env.TAG_NAME}-build-${currentBuild.number} vendor/bin/behat"
            } catch (err) {
                sh 'docker-compose -f docker-compose.jenkins.yml down -v'
                sh "docker network rm halv2_event-broker-default-${env.TAG_NAME}-build-${currentBuild.number}"
                sh "rm -rf *"
                sh "rm -rf .git .gitignore"
                sh "docker system prune -f"
                throw err
            }
        }
        stage ('Docker Cleanup') {
            sh 'docker-compose -f docker-compose.jenkins.yml down -v'
            sh "docker network rm halv2_event-broker-default-${env.TAG_NAME}-build-${currentBuild.number}"
            sh "rm -rf *"
            sh "rm -rf .git .gitignore"
            sh "docker system prune -f"
        }
//         stage ('Building & Push Docker Image') {
//             checkout scm
//             def tag = sh(returnStdout: true, script: "git tag --contains | head -1").trim()
//
//             docker.build("low-emedia/hal-event-broker:latest")
//             docker.withRegistry('https://540688370389.dkr.ecr.eu-west-1.amazonaws.com', 'ecr:eu-west-1:aws-lowemedia') {
//                 docker.image("low-emedia/hal-event-broker").push(tag)
//             }
//             sh "docker system prune -f"
//         }
//
//         def userInput
//         try {
//             userInput = input(
//                 id: 'Proceed1', message: 'Was this successful?', parameters: [
//                 [$class: 'BooleanParameterDefinition', defaultValue: false, description: '', name: 'Please confirm you agree with this']
//                 ])
//         } catch(err) { // input false
//         }
//
//         if (userInput == true) {
//             stage ('Deploying to ECS') {
//                 sh "sed -i \"s/#{TAG_NAME}#/${env.TAG_NAME}/\" task-definitions.json"
//                 sh "./deploy.sh"
//             }
//         } else {
//             echo 'No Production Deployment'
//         }
}

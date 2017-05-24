const config = require('./config');
const logger = require('./logger');
const fetch = require('node-fetch');
const fs = require('fs');
const prepare = require('./helpers/prepare');


const headers = { 'X-Auth-Token': config.token };

function exportCompetition (competitionId, filename) {
    logger.info(`${competitionId}: started`);
    return Promise.all([
            fetch(`http://api.football-data.org/v1/competitions/${competitionId}/fixtures`, { headers: headers }),
            fetch(`http://api.football-data.org/v1/competitions/${competitionId}/teams`, { headers: headers })
        ])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(([fixtures, teams]) => {
            logger.info(`${competitionId}: fetched`);
            const fields = ['date', 'status', 'matchday', 'homeTeamName', 'awayTeamName', 'result'];
            const processed = fixtures.fixtures
                .filter(fixture => fixture.homeTeamName !== '&nbsp;Ludogorets')
                .map(fixture => {
                    return Object.keys(fixture)
                        .filter(field => fields.includes(field))
                        .reduce((obj, field) => Object.assign(obj, {
                            [field]: prepare(field, fixture[field], { competitionId: competitionId, teams: teams.teams })
                        }), {});
            });

            const json = JSON.stringify({ fixtures: processed });

            fs.writeFile(`json/${filename}.json`, json, 'utf8', () => logger.info(`${competitionId}: saved to ${filename}.json`));
        })
        .catch(error => logger.error(`${competitionId}: ${error}`));

}

function exportCompetitions() {
    if (!['competitions', 'token'].every(param => config[param])) {
        logger.error('Please, specify token and competitions in the config');
        return;
    }

    config.competitions.forEach((competition, i) => {
        logger.info(`exporting competition ${i+1} of ${config.competitions.length}`);
        const filename = competition.name || competition.id.toString();
        exportCompetition(competition.id, filename)
    });
}

exportCompetitions();

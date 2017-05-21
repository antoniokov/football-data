const config = require('./config');
const logger = require('./logger');
const fetch = require('node-fetch');
const fs = require('fs');

function exportCompetition (competitionId, filename) {
    logger.info(`${competitionId}: started`);
    return fetch(`http://api.football-data.org/v1/competitions/${competitionId}/fixtures`,
        { headers: { 'X-Auth-Token': config.token } })
        .then(res => res.json())
        .then(raw => {
            logger.info(`${competitionId}: fetched`);
            const fields = ['date', 'status', 'matchday', 'homeTeamName', 'awayTeamName', 'result'];
            const processed = raw.fixtures.map(fixture => {
                return Object.keys(fixture)
                    .filter(field => fields.includes(field))
                    .reduce((obj, field) => Object.assign(obj, { [field]: fixture[field] }), {});
            });

            const json = JSON.stringify({ fixtures: processed });

            fs.writeFile(`json/${filename}.json`, json, 'utf8', () => logger.info(`${competitionId}: saved`));
        })
        .catch(error => logger.error(`${competitionId}: ${error}`));

}

function exportCompetitions() {
    if (!['competitions', 'token'].every(param => config[param])) {
        logger.error('Please, specify token and competitions in the config');
        return;
    }

    config.competitions.forEach((competitionId, i) => {
        logger.info(`exporting competition ${i+1} of ${config.competitions.length}`);
        const filename = config.filenames[i] || competitionId.toString();
        exportCompetition(competitionId, filename)
    });
}

exportCompetitions();

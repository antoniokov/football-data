const englishCompetitions = [426];
const fullNameCompetitions = [430];


module.exports = function (field, value, options) {
    if (field.includes('TeamName')) {
        if (englishCompetitions.includes(options.competitionId)) {
            return value
                .replace('AFC','')
                .replace('FC', '')
                .trim();
        }

        const team = options.teams.filter(team => team.name === value)[0];
        const name = team && !fullNameCompetitions.includes(options.competitionId)
            ? team.shortName || value
            : value;

        return {
            '1. Köln': '1. FC Köln',
            'Ingolstadt 04': 'FC Ingolstadt 04',

            'Eindhoven': 'PSV Eindhoven',
            'Alkmaar': 'AZ Alkmaar',
            'Arnheim': 'Vitesse',
            'Enschede': 'Twente',
            'Almelo': 'Heracles Almelo',
            'Willem': 'Willem II',
            'Deventer': 'Go Ahead Eagles',

            'PSG': 'Paris Saint-Germain',
            'St. Etienne': 'Saint-Étienne',

            'Inter': 'Internazionale',

            'Lisbon': 'Benfica',
            'Guimares': 'Vitória de Guimarães',
            'M Funchal': 'Maritimo',
            'Setubal': 'Vitória de Setúbal',
            'Ferreira': 'Paços de Ferreira',
            'B. Lisbon': 'Belenenses',
            'Funchal': 'Nacional',

            'Atlético': 'Atlético Madrid',
            'Athletic': 'Athletic Bilbao',
            'Alaves': 'Alavés',
            'Betis': 'Real Betis',
            'Deportivo': 'Deportivo La Coruña',
            'Leganes': 'Leganés',
            'Gijón': 'Sporting Gijón'
        }[name] || name;
    }

    return value;
};

var checkMissingDependencies = function(evaluationResult) {
    var moduleId, dependencyIds;
    for (moduleId in evaluationResult.modules) {
        if (evaluationResult.modules.hasOwnProperty(moduleId)) {
            dependencyIds = evaluationResult.modules[moduleId] || [];
            dependencyIds.forEach(function(dependencyId) {
                if (!evaluationResult.modules[dependencyId]) {
                    evaluationResult.errors.push('missing dependency ' + dependencyId + ' in ' + moduleId + '.js');
                }
            });
        }
    }
};

exports.checkMissingDependencies = checkMissingDependencies;
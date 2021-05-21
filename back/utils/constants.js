module.exports.types = {
  head: ['owner', 'manager'],
  topLevel: ['owner', 'manager', 'cashier'],
  everyone: ['owner', 'manager', 'cashier', 'seller']
}

const generic = {
  sellerId: {
    required: ['ID do vendedor é obrigatória.', true],
    invalid: ['ID do vendedor inválida.', true],
    base: ['ID do vendedor deve ser uma string.', true],
    empty: ['ID do vendedor não deve estar vazio.', false],
    any: ['ID do vendedor deve existir.', true]
  },
  storeId: {
    empty: ['ID da loja não deve estar vazio.', true],
    invalid: ['ID da loja inválida.', true],
    any: ['ID da loja deve existir.', true],
    base: ['ID da loja deve ser uma string.', true]
  }
}
module.exports.errorList = {
  // Tag da falha: [Mensagem amigável, suspeito?]
  // Regex p/ verificar se algum ficou sem ponto final: (?!\.)([a-z0-9]+)',

  'undefined.undefined.object.and': ['Está faltando mais parâmetros.', true],
  'fields.fields.object.unknown': ['Parâmetro inválido', true],

  // Paginação
  'sort.sort.any.only': ['Tipo de filtro de ordenação inválido.', true],
  'page.page.number.base': ['Valor de página deve ser um número.', true],
  'limit.limit.number.base': ['Valor de quantidade de ítens por página deve ser um número.', true],

  // User
  'search.search.string.empty': ['String de pesquisa não deve ser vazia.', false],
  'cpf.cpf.any.required': ['CPF é obrigatório.', false],
  'cpf.cpf.any.invalid': ['CPF inválido.', false],
  'cpf.cpf.string.length': ['Tamanho do cpf inválido.', false],
  'name.first.string.min': ['Primeiro nome deve ter no mínimo 3 caracteres.', false],
  'name.first.string.empty': ['Primeiro nome não deve ser vazio.', false],
  'name.first.any.required': ['Primeiro nome é obrigatório.', false],
  'name.first.string.base': ['Primeiro nome deve ser uma string.', true],
  'name.last.string.min': ['Sobrenome deve ter no mínimo 3 caracteres.', false],
  'name.last.string.empty': ['Sobrenome não deve ser vazio.', false],
  'name.last.any.required': ['Sobrenome é obrigatório.', false],
  'name.last.string.base': ['Sobrenome deve ser uma string.', true],
  'gender.gender.any.only': ['Gênero inválido.', false],
  'email.email.string.base': ['Email deve ser uma string.', true],
  'email.email.string.email': ['Email inválido.', false],
  'email.email.any.required': ['Email é obrigatório para esse tipo de usuário', false],
  'birthDate.birthDate.date.format': ['Formato de data de nascimento inválida.', true],
  'birthDate.birthDate.date.base': ['Data de nascimento deve ser uma data.', true],

  // Auth
  'login.login.any.required': ['Login é obrigatório.', true],
  'login.login.string.empty': ['Login não deve ser vazio.', false],
  'login.login.string.base': ['Login deve ser uma string.', true],
  'login.login.string.min': ['Login deve ter no mínimo 6 caracteres.', false],
  'login.login.string.max': ['Login deve ter no máximo 100 caracteres.', false],
  'password.password.any.required': ['Senha é obrigatória.', true],
  'password.password.string.empty': ['Senha não deve ser vazia.', false],
  'password.password.string.base': ['Senha deve ser uma string.', true],
  'password.password.string.min': ['Senha deve ter no mínimo 6 caracteres.', false],
  'password.password.string.max': ['Senha deve ter no mínimo 100 caracteres.', false],

  // Day
  'activities.type.any.required': ['Tipo de atividade é obrigatório.', false],
  'activities.type.any.only': ['Tipo de atividade não é permitido.', true],
  'activities.sellerId.any.required': generic.sellerId.required,
  'activities.sellerId.any.invalid': generic.sellerId.invalid,
  'activities.sellerId.string.base': generic.sellerId.base,
  'activities.sellerId.string.empty': generic.sellerId.empty,
  'activities.date.any.required': ['Data da atividade é obrigatória.', true],
  'activities.date.date.base': ['Data da atividade deve estar em formato de data.', true],
  'activities.date.date.format': ['Data da atividade deve ter o formato ISO.', true],
  'events.entryType.any.required': ['Tipo de entrada de evento é obrigatório.', false],
  'events.entryType.any.only': ['Tipo de entrada de evento não permitido.', true],
  'events.success.any.required': ['Parâmetro success é obrigatório no evento.', true],
  'events.success.boolean.base': ['Parâmetro success deve ser um booleano.', true],
  'events.period.any.required': ['Objeto de período é obrigatório.', false],
  'events.period.object.base': ['Período deve ser um objeto.', true],
  'events.start.any.required': ['Data de início do período é obrigatória.', true],
  'events.start.date.base': ['Data de início do período deve estar em formato de data.', true],
  'events.start.date.format': ['Data de início do período deve ter o formato ISO.', true],
  'events.end.any.required': ['Data de fim do período é obrigatória.', true],
  'events.end.date.base': ['Data de fim do período deve estar em formato de data.', true],
  'events.end.date.format': ['Data de fim do período deve ter o formato ISO.', true],
  'events.title.any.required': ['Objeto de opção selecionada deve conter um título.', false],
  'events.title.string.empty': ['O título do evento não deve ser vazio.', false],
  'events.title.string.base': ['O título do evento deve ser uma string.', true],
  'events.title.string.max': ['O título do evento deve ter no máximo 150 caracteres.', false],
  'events.options.array.base': ['As sub-opções do objeto de opção selecionada deve ser um array.', true],
  'events.sellerId.any.required': generic.sellerId.required,
  'events.sellerId.any.invalid': generic.sellerId.invalid,
  'events.sellerId.string.base': generic.sellerId.base,
  'events.sellerId.string.empty': generic.sellerId.empty,
}

import {ILanguage, ILanguageLocalization, IErrorGeneric} from '../store/models/language.interface'

const  localization : ILanguageLocalization = {
  header: {
    actions: "Ações",
  },
  body: {
    emptyDataSourceMessage: "",
    addTooltip: "Adicionar",
    editTooltip: "Editar",
    deleteTooltip: "Deletar",
    editRow: {
      cancelTooltip: "Cancelar",
      saveTooltip: "Confimar",
      deleteText: "Deseja apagar essa linha ?"
    },
  },
  toolbar: {
    searchTooltip: "Pesquisar",
    searchPlaceholder: "Pesquisar",
    nRowsSelected: '{0} linha(s) selecionada(s)'
  },
  pagination: {
    labelRowsSelect: "linhas",
    labelDisplayedRows: "{count} de {from}-{to}",
    firstTooltip: "Primeira página",
    previousTooltip: "Página anterior",
    nextTooltip: "Próxima página",
    lastTooltip: "Última página",
  },
}

const errorGeneric: IErrorGeneric = {
  title: "Ocorreu um erro",
  text: "Entre em contato com a equipe tecnica."
}


const common = {
  materialTable:{
    localization:localization
  },
  errorGeneric:errorGeneric
}

export const ptBR : ILanguage = {
  generic: {
    localization: common.materialTable.localization,
    notification:common.errorGeneric,
  },
  reseller: {
    localization: common.materialTable.localization,
    notification:common.errorGeneric,
    link:'Link de redirecionamento',
    list:'Lista de Revendedores',
    pending: 'Pendentes',
    approved:'',
    refresh: 'Recarregar',
    addTooltip: 'Adicionar',
    id: '#',
    cnpj: 'CNPJ',
    cpf: 'CPF',
    cpfOrCnpj:'CPF/CNPJ',
    name: 'Nome',
    tradeName:'Razao Social',
    areaCode: 'DDD',
    cellPhone: 'Celular',
    email: 'E-mail',
    isAuthorizedResale: 'Autorizado',
    corporateName: 'Nome Fantasia',
    publicPlace: 'logradouro',
    publicPlaceNumber: 'Numero',
    publicPlaceComplement: 'Complemento',
    publicPlacePostalCode: 'CEP',
    neighborhood: 'Bairro',
    city: 'Cidade',
    state: 'Estado',
  }
}


export default ptBR

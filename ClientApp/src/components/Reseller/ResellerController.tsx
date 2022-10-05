import React, { FormEvent } from "react";
import { addNotification } from "../../store/actions/notifications.action";
import { addModal, removeModal } from "../../store/actions/modals.action";
import {
  setModificationState,
  editReseller,
  addReseller,
  removeReseller,
} from "../../store/actions/resellers.actions";

import {
  IReseller,
  ResellerModificationStatus,
} from "../../store/models/reseller.interface";

import {
  OnChangeModel,
  IResellerFormState,
} from "../../common/types/Form.types";

import {
  maskCPF,
  maskCNPJ,
  maskPhoneNumber,
  maskZipCode,
  maskMoneyToLocaleString,
  removeMaskMoneyToLocaleString,
  removeMaskZipCode,
  removeCNPJ,
  removeCPF,
  maskNumberInt,
  removePhoneNumber,
} from "../../Utils/mask.util";
import services from "../../requester/services";
import requester from "../../requester/requester";
import { History } from "history";
import { AnyAaaaRecord } from "dns";

export const addCardTypeOperator = (
  setFormState: (arg0: (prevState: any) => any) => void,
  formState: IResellerFormState,
  item: any
) => {
  let maxId: number = Math.max.apply(
    Math,
    formState.cardTypeOperator.value.map((o: any) => {
      return o.id;
    })
  );
  if (maxId === -Infinity) {
    maxId = 0;
  }

  setFormState((prevState: any) => ({
    ...prevState,
    cardTypeOperator: {
      error: "",
      value: [...prevState.cardTypeOperator.value, item],
    },
  }));
};

export const addResellerList = async (
  dispatch: { (value: any): void; (arg0: any): any; (arg0: any): void },
  setLoader: (arg0: boolean) => void,
  goBack: (arg0: any) => any,
  history: any,
  token: string,
  reseller: IReseller,
  array: any = []
) => {
  console.log(reseller);
  const newQuestion: IReseller = {
    ...reseller,
  };
  if (reseller) {
    (await _postApiReseller(
      dispatch,
      setLoader,
      goBack,
      history,
      token,
      newQuestion
    )) && dispatch(addReseller(newQuestion));
  }
};

export const authorizedResale = (
  setFormState: (arg0: any) => void,
  dispatch: (arg0: any) => void,
  isFormInvalid: (isFormInvalid: any) => any,
  formState: IResellerFormState
) => {
  if (!isFormInvalid(formState)) {
    dispatch(
      addModal(
        "Atenção",
        `Tem certeza que deseja concluir o cadastro ?`,
        "submit",
        () => null
      )
    );
    setFormState({
      ...formState,
      isAuthorizedResale: { error: "", value: true },
    });
  } else {
    dispatch(
      addModal(
        "Atenção",
        `Não foi possivel concluir o cadastro favor verificar os campos e tentar novamente.?`,
        "ok",
        () => null
      )
    );
  }
};

export const editResellerList = async (
  dispatch: (arg0: any) => void,
  setLoader: (arg0: boolean) => void,
  goBack: (arg0: any) => void,
  history: any,
  token: string,
  reseller: IReseller,
  id: string,
  array: any = []
) => {
  console.log(reseller);
  const newQuestion = {
    ...reseller,
  };
  if (reseller) {
    (await _putApiReseller(dispatch, setLoader, goBack, history, token, id, {
      ...reseller,
    })) && dispatch(editReseller(newQuestion));
  }
};

export const getCardTypeOperatorAndValues = async (
  dispatch: (arg0: any) => void,
  setFormState: (arg0: (prevState: any) => any) => any,
  isAuthorizedResale: any,
  token: any,
  id: string
) => {
  try {
    const service = {
      ...services.getResellerCardTypeOperatorAndValues,
      endpoint: services.getResellerCardTypeOperatorAndValues.endpoint.replace(
        "{{id}}",
        id
      ),
    };
    const account = { token: token };

    const [error, response]: any = await requester(account, service);
    if (!error) {
      let cardTypeOperatorArray = response.map((e: any) => {
        e.commisValue = e.commisValue.toFixed(2);
        return e;
      });
      const cardTypeOperatorArrayLookup = cardTypeOperatorArray.map(
        (item: any) => {
          return { [item.id]: item.fullName };
        }
      );
      console.log(cardTypeOperatorArrayLookup);
      const cardTypeOperatorLookup = Object.assign(
        {},
        ...cardTypeOperatorArrayLookup
      );

      isAuthorizedResale &&
        setFormState((prevState: any) => ({
          ...prevState,
          cardTypeOperator: { error: "", value: cardTypeOperatorArray },
        }));
    } else {
      dispatch(
        addNotification(
          "Ocorreu um erro",
          `Entre em contato com a equipe tecnica.`
        )
      );
    }
    return !error;
  } catch (error) {
    return false;
    console.error(error);
  }
};

export const getResellerBill = async (
  setFormState: (arg0: (prevState: any) => any) => void,
  dispatch: (arg0: any) => void,
  token: any,
  id: string
) => {
  try {
    const service = {
      ...services.getResellerBill,
      endpoint: services.getResellerBill.endpoint.replace("{{id}}", id),
    };
    const account = { token: token };

    const [error, response]: any = await requester(account, service);

    if (!error) {
      setFormState((prevState: any) => ({
        ...prevState,
        bill: {
          error: "",
          value: response,
        },
      }));
    } else {
      dispatch(
        addNotification(
          "Ocorreu um erro",
          `Entre em contato com a equipe tecnica.`
        )
      );
    }
  } catch (error) {
    return false;
    console.error(error);
  }
};

export const getResellerEquipment = async (
  setFormState: (arg0: (prevState: any) => any) => void,
  dispatch: (arg0: any) => void,
  token: any,
  id: string
) => {
  try {
    const service = {
      ...services.getResellerEquipment,
      endpoint: services.getResellerEquipment.endpoint.replace("{{id}}", id),
    };
    const account = { token: token };

    const [error, response]: any = await requester(account, service);

    if (!error) {
      setFormState((prevState: any) => ({
        ...prevState,
        equipment: {
          error: "",
          value: response,
        },
      }));
    } else {
      dispatch(
        addNotification(
          "Ocorreu um erro",
          `Entre em contato com a equipe tecnica.`
        )
      );
    }
  } catch (error) {
    return false;
    console.error(error);
  }
};

export const getState: any = async (
  setFormState: ((arg0: (prevState: any) => any) => void) | undefined,
  token: undefined
) => {
  try {
    const { getState: service } = services;
    const [error, response]: any =
      requester && (await requester({ token: token }, service));

    setFormState &&
      setFormState((prevState: any) => ({
        ...prevState,
        stateList: { error: "", value: response },
      }));

    return response;
  } catch (error) {
    console.error(error);
  }
};

export const getCardTypeOperatorAndParameters = async (
  setFormState: (arg0: {
    (prevState: any): any;
    (prevState: any): any;
  }) => void,
  dispatch: (arg0: any) => void,
  token: any,
  isAuthorizedResale: any
) => {
  try {
    const service = {
      ...services.getCardTypeOperatorAndParameters,
    };
    const account = { token: token };

    const [error, response]: any = await requester(account, service);
    if (!error) {
      let cardTypeOperatorArray = response.map((e: any) => {
        e.commisValue = e.commisValue.toFixed(2);
        return e;
      });
      const cardTypeOperatorArrayLookup = cardTypeOperatorArray.map(
        (item: any) => {
          return { [item.id]: item.fullName };
        }
      );
      const cardTypeOperatorLookup = Object.assign(
        {},
        ...cardTypeOperatorArrayLookup
      );

      const operatorArrayLookup = cardTypeOperatorArray.map((item: any) => {
        return { [item.operatorId]: item.operatorName };
      });

      const operatorLookup = Object.assign({}, ...operatorArrayLookup);

      !isAuthorizedResale &&
        setFormState((prevState: any) => ({
          ...prevState,
          cardTypeOperator: { error: "", value: cardTypeOperatorArray },
        }));

      setFormState((prevState: any) => ({
        ...prevState,
        cardTypeOperatorLookup: {
          error: "",
          value: cardTypeOperatorLookup,
        },
        operatorLookup: {
          error: "",
          value: operatorLookup,
        },
      }));
    } else {
      dispatch(
        addNotification(
          "Ocorreu um erro",
          `Entre em contato com a equipe tecnica.`
        )
      );
    }
    return !error;
  } catch (error) {
    return false;
    console.error(error);
  }
};

export const getDisabledClass = (formState: IResellerFormState): string => {
  let isError: boolean = isFormInvalid(formState);
  return isError ? "disabled" : "";
};

export const goBack = (history: any): any => {
  return history.goBack();
};

export const hasFormValueChanged = (
  setFormState: (arg0: any) => void,
  formState: IResellerFormState,
  model: OnChangeModel
) => {
  setFormState({
    ...formState,
    [model.field]: { error: model.error, value: model.value },
  });
};

export const hasFormValueChangedArray = (
  setFormState: (arg0: (prevState: any) => any) => void,
  formState: any,
  model: OnChangeModel,
  position: number
): any => {
  let form: any = formState;
  let fieldArray = model.field.split(".");
  let field = form[fieldArray[0]];
  field.value[position] = {
    ...field.value[position],
    [fieldArray[1]]: model.value,
  };

  setFormState({
    ...formState,
    [model.field]: { error: model.error, field },
  });
};

export const inativeEquipment = (
  setFormState: (arg0: (prevState: any) => any) => void,
  item: any
) => {
  setFormState((prevState: any) => ({
    ...prevState,
    equipment: {
      error: "",
      value: [
        ...prevState.equipment.value.map((pr: any) =>
          Number(pr.id) === Number(item.id) ? { ...item, status: false } : pr
        ),
      ],
    },
  }));
};

export const isFormInvalid = (formState: IResellerFormState): boolean => {
  return (
    //  formState.amountOfEquipment.error ||
    // !formState.amountOfEquipment.value ||
    // !(formState.typeReseller.value > 0 ) ||
    !(formState.name.value || formState.corporateName.value) ||
    !formState.areaCode.value ||
    formState.areaCode.error !== '' ||
    !formState.cellPhone.value ||
    formState.cellPhone.error !== '' ||
    !formState.email.value
  );
};

export const notAuthorizedResale = (
  dispatch: (arg0: any) => void,
  setFormState: (arg0: any) => void,
  formState: any
) => {
  dispatch(
    addModal(
      "Atenção",
      `Tem certeza que deseja alterar o cadastro ?`,
      "submit",
      () => null
    )
  );

  setFormState({
    ...formState,
    isAuthorizedResale: { error: "", value: false },
  });
};

export const updateUser = (
  dispatch: (arg0: any) => void,
  setLoader: (arg0: boolean) => void,
  setModal: (arg0: (prev: boolean) => boolean) => void,
  formState: IResellerFormState,
  isFormInvalid: any,
  history: any,
  isAuthorizedResale: any,
  token: string,
  id: string,
  e: FormEvent<HTMLFormElement>
): void => {
  e.preventDefault();
  if (isFormInvalid(formState) && formState.isAuthorizedResale.value) {
    toggleModal(setModal);

    dispatch(
      addModal(
        "Atenção",
        "Não foi possivel alterar o cadastro favor verificar os campos e tentar novamente.",
        "ok",
        () => null
      )
    );

    return;
  } else {
    const idModal: any = Array.from(e.currentTarget).find(
      (e) => e.id === "modalId"
    );

    idModal && dispatch(removeModal(Number(idModal.value)));
  }

  formState.isAuthorizedResale.value =
    Number(formState.isAuthorizedResale.value) === 1 ? true : false;
  formState.isActive.value =
    Number(formState.isActive.value) === 1 ? true : false;

  const reseller: any = {
    id: Number(id),
    parentCompanyId: formState.parentCompanyId.value,
    cnpj: formState.cnpj.value,
    cpf: formState.cpf.value,
    name: formState.name.value,
    areaCode: formState.areaCode.value,
    cellPhone: formState.cellPhone.value,
    email: formState.email.value,
    isAuthorizedResale: formState.isAuthorizedResale.value,
    corporateName: formState.corporateName.value,
    publicPlace: formState.publicPlace.value,
    publicPlaceNumber: formState.publicPlaceNumber.value,
    publicPlaceComplement: formState.publicPlaceComplement.value,
    publicPlacePostalCode: removeMaskZipCode(
      formState.publicPlacePostalCode.value
    ),
    neighborhood: formState.neighborhood.value,
    city: formState.city.value,
    state: formState.state.value,
    cardTypeOperator: formState.cardTypeOperator.value.map(
      (e: any, index: number) => {
        e.commisValue =
          typeof e.commisValue === "number"
            ? e.commisValue.toFixed(2)
            : Number(removeMaskMoneyToLocaleString(e.commisValue));
        e.id = Number(e.id);
        e.operatorId = Number(e.operatorId);
        return e;
      }
    ),
    bill: formState.bill.value,
    equipment: formState.equipment.value,
    amountOfEquipment: formState.amountOfEquipment.value,
    isActive: formState.isActive.value,
    typeReseller:
      typeof formState.typeReseller.value === "number"
        ? formState.typeReseller.value
        : Number(formState.typeReseller.value),
    isSpecial: formState.resellerTypeSelected.value == 2 ? true : false,
    isSuspendedResale:
      formState.isSuspendedResaleSelected.value == 2 ? true : false,
    sendEmail: !isAuthorizedResale,
  };

  if (Number(formState.typeReseller.value) === 1) {
    reseller.limitReseller = 0;
    reseller.numberOfDaysForPayment = 0;
  } else {
    reseller.numberOfDaysForPayment = formState.numberOfDaysForPayment.value;
    reseller.limitReseller =
      typeof formState.limitReseller.value === "number"
        ? formState.limitReseller.value
        : removeMaskMoneyToLocaleString(formState.limitReseller.value);
  }

  editResellerList(dispatch, setLoader, goBack, history, token, reseller, id);
  isAuthorizedResale !== formState.isAuthorizedResale.value &&
    removeReseller(id);
};

export const removeCardTypeOperator = (
  setFormState: (arg0: (prevState: any) => any) => void,
  id: any
) => {
  setFormState((prevState: any) => ({
    ...prevState,
    cardTypeOperator: {
      error: "",
      value: [
        ...prevState.cardTypeOperator.value.filter(
          (pr: any) => Number(pr.id) !== Number(id)
        ),
      ],
    },
  }));
};

export const updateCardTypeOperator = (
  setFormState: (arg0: (prevState: any) => any) => void,
  item: any
) => {
  setFormState((prevState: any) => ({
    ...prevState,
    cardTypeOperator: {
      error: "",
      value: [
        ...prevState.cardTypeOperator.value.map((pr: any) =>
          Number(pr.id) === Number(item.id) ? item : pr
        ),
      ],
    },
  }));
};

export const _postApiReseller = async (
  dispatch: (arg0: any) => void,
  setLoader: (arg0: boolean) => void,
  goBack: (arg0: any) => void,
  history: any,
  token: any,
  body: object
) => {
  try {
    setLoader(true);
    const service = {
      ...services.postReseller,
    };
    const account = { token: token };
    const options = {
      data: body,
    };
    const [error]: any = await requester(account, service, options);
    if (!error) {
      setLoader(false);
      dispatch(setModificationState(ResellerModificationStatus.Edit));
      // tiririca
      dispatch(addModal(
        "Parabéns",
        "Foi enviado um email para a entidade com a senha de acesso.",
        "ok",
        () => null
      ));
      
      goBack(history);
    } else {
      setLoader(false);
      dispatch(
        addNotification(
          "Ocorreu um erro",
          `Entre em contato com a equipe tecnica.`
        )
      );
    }
    return !error;
  } catch (error) {
    return false;
    console.error(error);
  }
};

export const _putApiReseller = async (
  dispatch: (arg0: any) => void,
  setLoader: (arg0: boolean) => void,
  goBack: (arg0: any) => void,
  history: any,
  token: string,
  id: string,
  body: object
) => {
  try {
    setLoader(true);
    const service = {
      ...services.putReseller,
      endpoint: services.putReseller.endpoint.replace("{{id}}", id),
    };
    const account = { token: token };
    const options = {
      data: body,
    };
    const [error]: any = await requester(account, service, options);
    if (!error) {
      setLoader(false);
      dispatch(setModificationState(ResellerModificationStatus.Edit));
      dispatch(addNotification("Sucesso", ``));
      goBack(history);
    } else {
      setLoader(false);
      dispatch(
        addNotification(
          "Ocorreu um erro",
          `Entre em contato com a equipe tecnica.`
        )
      );
    }
    return !error;
  } catch (error) {
    return false;
    console.error(error);
  }
};

export const toggleModal = (
  setModal: (arg0: (prev: boolean) => boolean) => void
): void => {
  setModal((prev: boolean) => !prev);
};

export const saveEdit = (
  dispatch: (arg0: any) => void,
  isFormInvalid: any,
  formState: IResellerFormState
): void => {
  if (!isFormInvalid(formState)) {
    // toggleModal()
    dispatch(
      addModal(
        "Atenção",
        `Tem certeza que deseja alterar o cadastro ?`,
        "submit",
        () => null
      )
    );
  } else {
    dispatch(
      addModal(
        "Atenção",
        "Não foi possivel alterar o cadastro favor verificar os campos e tentar novamente.",
        "ok",
        () => null
      )
    );
  }
};

export const saveUser = (
  dispatch: {
    (value: any): void;
    (arg0: any): void;
    (value: any): void;
    (arg0: any): any;
    (arg0: any): void;
  },
  setModal: (arg0: (prev: boolean) => boolean) => void,
  formState: IResellerFormState,
  setLoader: (arg0: boolean) => void,
  goBack: { (history: any): any; (arg0: any): any },
  history: any,
  token: string,
  isAuthorizedResale: any,
  e: FormEvent<HTMLFormElement>
): void => {
  e.preventDefault();
  if (isFormInvalid(formState)) {
    toggleModal(setModal);

    dispatch(
      addModal(
        "Atenção",
        "Não foi possivel alterar o cadastro favor verificar os campos e tentar novamente.",
        "ok",
        () => null
      )
    );

    return;
  } else {
    const idModal: any = Array.from(e.currentTarget).find(
      (e) => e.id === "modalId"
    );

    idModal && dispatch(removeModal(Number(idModal.value)));
  }

  formState.isAuthorizedResale.value =
    Number(formState.isAuthorizedResale.value) === 1 ? true : false;
  formState.isActive.value =
    Number(formState.isActive.value) === 1 ? true : false;
  let typeReseller = formState.typeReseller.value || 1;
  typeReseller =
    typeof formState.typeReseller.value === "number"
      ? formState.typeReseller.value
      : Number(formState.typeReseller.value);

  const reseller: any = {
    parentCompanyId: formState.parentCompanyId.value,
    cnpj: removeCNPJ(formState.cnpj.value),
    cpf: removeCPF(formState.cpf.value),
    name: formState.name.value,
    areaCode: formState.areaCode.value,
    cellPhone: removePhoneNumber(formState.cellPhone.value),
    email: formState.email.value,
    isAuthorizedResale: formState.isAuthorizedResale.value,
    corporateName: formState.corporateName.value,
    publicPlace: formState.publicPlace.value,
    publicPlaceNumber: formState.publicPlaceNumber.value,
    publicPlaceComplement: formState.publicPlaceComplement.value,
    publicPlacePostalCode: removeMaskZipCode(
      formState.publicPlacePostalCode.value
    ),
    neighborhood: formState.neighborhood.value,
    city: formState.city.value,
    state: formState.state.value,
    cardTypeOperator: formState.cardTypeOperator.value.map(
      (e: any, index: number) => {
        e.commisValue =
          typeof e.commisValue === "number"
            ? Number(removeMaskMoneyToLocaleString(e.commisValue))
            : Number(removeMaskMoneyToLocaleString(e.commisValue));
        e.id = Number(e.id);
        e.operatorId = Number(e.operatorId);
        return e;
      }
    ),
    bill: formState.bill.value,
    equipment: formState.equipment.value,
    amountOfEquipment: formState.amountOfEquipment.value,
    isActive: formState.isActive.value,
    typeReseller: typeReseller,
    isSpecial: formState.resellerTypeSelected.value == 2 ? true : false,
    isSuspendedResale:
      formState.isSuspendedResaleSelected.value == 2 ? true : false,
    sendEmail: !isAuthorizedResale,
  };

  if (Number(formState.typeReseller.value) === 1) {
    reseller.limitReseller = 0;
    reseller.numberOfDaysForPayment = 0;
  } else {
    reseller.numberOfDaysForPayment = formState.numberOfDaysForPayment.value;
    reseller.limitReseller =
      typeof formState.limitReseller.value === "number"
        ? formState.limitReseller.value
        : removeMaskMoneyToLocaleString(formState.limitReseller.value);
  }

  addResellerList(dispatch, setLoader, goBack, history, token, reseller);
};

import { RefCallback } from "react";
import { useRef } from "react";

type HTMLFieldElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

/**
 * `useRefForm` crée un objet avec des références aux entrées de formulaire et
 * fournit des méthodes pour obtenir et définir leurs valeurs.
 * @param fields - Un tableau de chaînes représentant les noms des entrées de formulaire pour
 * lesquelles le crochet useRefForm sera utilisé.
 * @returns un tableau contenant deux éléments : le premier élément est un objet `useRef` initialisé
 * avec un objet contenant des valeurs nulles pour chaque entrée, et le deuxième élément est un objet
 * contenant des fonctions pour interagir avec l'objet `useRef`.
 *
 * Les fonctions incluent `setRef` pour définir la référence d'un élément d'entrée à
 * l'objet `useRef`, `getRef` pour obtenir la valeur d'un élement d'entrée,
 * `getAllRef` pour obtenir un objet avec pour clé le nom de l'élément et pour
 * valeur la valeur de l'élément et `getFormData` pour obtenir un FormData prêt à
 * être envoyé.
 *
 * @example
 * useRefForm(['username', 'password'])
 * // => fieldsRef (à l'initialisation)
 * {
 *   username: null,
 *   password: null
 * }
 *
 * <input ref={setRef('username')} />
 * // => fieldsRef (affecte l'input avec la clé `username`)
 * {
 *   username: HTMLInputElement,
 *   password: null
 * }
 *
 * getRef('username') // Retourne la valeur contenue dans le champ
 *
 * getAllRef()
 * // Retourne les valeurs contenus dans les champs sous la forme suivante
 * {
 *   username: 'myusername',
 *   password: 'secret'
 * }
 *
 * getFormData()
 * // Retourne un FormData sous la forme suivante
 * [
 *   ['username', 'myusername'],
 *   ['password', 'secret']
 * ]
 */
export function useRefFields<FieldName extends string>(
  fields: ReadonlyArray<FieldName>
) {
  type Fields = Record<FieldName, HTMLFieldElement | null>;

  const initialState = fields.reduce(
    (obj, name: FieldName) => ({ ...obj, [name]: null }),
    {}
  ) as Fields;

  const fieldsRef = useRef<Fields>(initialState);

  /**
   * `setRef` envoie une fonction de rappel pour définir une référence à un élément
   * de champ HTMLFieldElement en fonction d'une clé donnée.
   * @param {FieldName} key - Clé correspondant à une valeur contenue dans le tableau
   * `fields`.
   * @returns `setRef` retourne un callback utilisé pour mettre à jour la référence
   * liée à la clé donnée.
   */
  const setRef =
    (key: FieldName): RefCallback<HTMLFieldElement> =>
    (ref: HTMLFieldElement) => {
      if (fields.includes(key)) fieldsRef.current[key] = ref;
    };

  /**
   * `getRef` retourne la valeur contenue dans la référence du fieldsRef à la clé donnée.
   * @param {FieldName} key - Le paramètre `key` est utilisé comme clé pour accéder à une valeur dans l'objet
   * `inputsRef.current`.
   *
   * @example
   * getRef('username')
   * // johndoe
   */
  const getRef = (key: FieldName): string => {
    assertIsDefined(fieldsRef.current[key], key);

    return fieldsRef.current[key]!.value;
  };

  /**
   * `getRef` retourne l'élément contenu dans la référence du fieldsRef à la clé donnée.
   * @param {FieldName} key - Le paramètre `key` est utilisé comme clé pour accéder à une valeur dans l'objet
   * `inputsRef.current`.
   *
   * @example
   * getField('username')
   */
  const getField = <T extends HTMLFieldElement = HTMLFieldElement>(
    key: FieldName
  ): T => {
    assertIsDefined(fieldsRef.current[key], key);

    return fieldsRef.current[key];
  };

  /**
   * `getAllRef` renvoie un objet contenant des valeurs à partir d'une liste de
   * références d'entrée.
   *
   * @example
   * getAllRef()
   * // Retourne les valeurs contenus dans les champs sous la forme suivante
   * {
   *   username: 'myusername',
   *   password: 'secret'
   * }
   */
  const getAllRef = () => {
    return fields.reduce(
      (obj, key) => ({
        ...obj,
        [key]: fieldsRef.current[key]?.value,
      }),
      initialState
    );
  };

  /**
   * `getFormData` obtient des données de formulaire à partir des champs d'entrée et les renvoie sous la
   * forme d'un objet FormData.
   *
   * @example
   * getFormData()
   * // Retourne un FormData sous la forme suivante
   * [
   *   ['username', 'myusername'],
   *   ['password', 'secret']
   * ]
   */
  const getFormData = () => {
    fields.every((key) => assertIsDefined(fieldsRef.current[key], key));

    return fields.reduce(
      (form, key) => (form.append(key, fieldsRef.current[key]!.value), form),
      new FormData()
    );
  };

  const actions = { setRef, getRef, getField, getAllRef, getFormData };
  return [fieldsRef, actions] as const;
}

/**
 * Type des actions de useRefFields. `Keys` est un Union Type des valeurs du
 * tableau passées en arguments de useRefFields.
 *
 * @example
 * export const connexionInputs = ['username', 'password'] as const
 * type Action = UseRefFieldsActions<(typeof connexionInputs)[number]>
 * //^?
 * type Actions = {
 *   setRef: (key: "username" | "password") => RefCallback<HTMLFieldElement>;
 *   getRef: (key: "username" | "password") => string;
 *   getAllRef: () => Record<"username" | "password", HTMLFieldElement | null>;
 *   getFormData: () => FormData;
 * }
 *
 * // Pour récupérer le type précis d'une des méthodes actions
 * type SetRefField = Actions['setRef']
 * //^?
 * type SetRefField = (key: "username" | "password") => RefCallback<HTMLFieldElement>
 */
export type UseRefFieldsActions<Keys extends string> = ReturnType<
  typeof useRefFields<Keys>
>[1];

/**
 * Cette fonction affirme qu'une valeur est définie et non nulle ou indéfinie.
 * @param {T} value - La valeur qui doit être vérifiée pour être définie (pas undefined ou null).
 * @param {string} key - Le paramètre clé est une chaîne qui représente le nom ou l'identifiant de la
 * variable ou de la propriété en cours de vérification pour être définie ou non. Il est utilisé dans
 * le message d'erreur pour indiquer quelle référence n'est pas définie.
 */
function assertIsDefined<T>(
  value: T,
  key: string
): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error(`La référence ${key} n'est pas affectée !`);
  }
}

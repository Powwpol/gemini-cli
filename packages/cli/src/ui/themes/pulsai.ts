/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Theme, type ColorsTheme } from './theme.js';

const pulsaiColors: ColorsTheme = {
  type: 'dark',
  // Noir
  Background: '#000000',
  // Gris clair (pour le texte sur fond noir)
  Foreground: '#EAEAEA',
  
  // Mapping de la palette SMP/Pulsai
  // Accentuation 6: Bleu foncé
  LightBlue: '#2751E3', 
  AccentBlue: '#2751E3',
  
  // Accentuation 1: Orange foncé (Utilisé comme couleur primaire/focus)
  AccentPurple: '#FA4616', 
  
  // Accentuation 2: Orange clair (Utilisé pour le cyan/secondaire)
  AccentCyan: '#FAC090',
  
  // Accentuation 3: Vert
  AccentGreen: '#00B050',
  
  // Accentuation 1: Orange (Remplace le jaune standard pour les warnings/highlights)
  AccentYellow: '#FA4616',
  
  // Accentuation 4: Rouge
  AccentRed: '#FF0000',
  
  // Accentuation 5: Vert foncé (Diff added)
  DiffAdded: '#43635A',
  
  // Rouge (Diff removed)
  DiffRemoved: '#FF0000',
  
  // Gris clair (Sombre 2) pour les commentaires
  Comment: '#F5F5F5',
  
  // Gris foncé pour les éléments passifs
  Gray: '#888888',
  DarkGray: '#444444',
  
  // Dégradé Orange -> Bleu
  GradientColors: ['#FA4616', '#FAC090', '#2751E3'],
};

export const PulsaiTheme: Theme = new Theme(
  'Pulsai',
  'dark',
  {
    hljs: {
      display: 'block',
      overflowX: 'auto',
      padding: '0.5em',
      background: pulsaiColors.Background,
      color: pulsaiColors.Foreground,
    },
    'hljs-keyword': {
      color: pulsaiColors.AccentPurple, // Orange
    },
    'hljs-literal': {
      color: pulsaiColors.AccentCyan, // Orange clair
    },
    'hljs-symbol': {
      color: pulsaiColors.AccentBlue, // Bleu
    },
    'hljs-name': {
      color: pulsaiColors.AccentBlue,
    },
    'hljs-link': {
      color: pulsaiColors.AccentPurple, // Orange (Lien hypertexte)
      textDecoration: 'underline',
    },
    'hljs-built_in': {
      color: pulsaiColors.AccentCyan,
    },
    'hljs-type': {
      color: pulsaiColors.AccentCyan,
    },
    'hljs-number': {
      color: pulsaiColors.AccentGreen,
    },
    'hljs-class': {
      color: pulsaiColors.AccentGreen,
    },
    'hljs-string': {
      color: pulsaiColors.AccentYellow, // Orange
    },
    'hljs-meta-string': {
      color: pulsaiColors.AccentYellow,
    },
    'hljs-regexp': {
      color: pulsaiColors.AccentRed,
    },
    'hljs-template-tag': {
      color: pulsaiColors.AccentRed,
    },
    'hljs-subst': {
      color: pulsaiColors.Foreground,
    },
    'hljs-function': {
      color: pulsaiColors.Foreground,
    },
    'hljs-title': {
      color: pulsaiColors.AccentCyan,
    },
    'hljs-params': {
      color: pulsaiColors.Foreground,
    },
    'hljs-formula': {
      color: pulsaiColors.Foreground,
    },
    'hljs-comment': {
      color: pulsaiColors.Comment,
      fontStyle: 'italic',
    },
    'hljs-quote': {
      color: pulsaiColors.Comment,
      fontStyle: 'italic',
    },
    'hljs-doctag': {
      color: pulsaiColors.Comment,
    },
    'hljs-meta': {
      color: pulsaiColors.Gray,
    },
    'hljs-meta-keyword': {
      color: pulsaiColors.Gray,
    },
    'hljs-tag': {
      color: pulsaiColors.Gray,
    },
    'hljs-variable': {
      color: pulsaiColors.AccentPurple,
    },
    'hljs-template-variable': {
      color: pulsaiColors.AccentPurple,
    },
    'hljs-attr': {
      color: pulsaiColors.LightBlue,
    },
    'hljs-attribute': {
      color: pulsaiColors.LightBlue,
    },
    'hljs-builtin-name': {
      color: pulsaiColors.LightBlue,
    },
    'hljs-section': {
      color: pulsaiColors.AccentYellow,
    },
    'hljs-emphasis': {
      fontStyle: 'italic',
    },
    'hljs-strong': {
      fontWeight: 'bold',
    },
    'hljs-bullet': {
      color: pulsaiColors.AccentYellow,
    },
    'hljs-selector-tag': {
      color: pulsaiColors.AccentYellow,
    },
    'hljs-selector-id': {
      color: pulsaiColors.AccentYellow,
    },
    'hljs-selector-class': {
      color: pulsaiColors.AccentYellow,
    },
    'hljs-selector-attr': {
      color: pulsaiColors.AccentYellow,
    },
    'hljs-selector-pseudo': {
      color: pulsaiColors.AccentYellow,
    },
    'hljs-addition': {
      backgroundColor: '#004400', // Vert très foncé fond
      color: pulsaiColors.AccentGreen,
      display: 'inline-block',
      width: '100%',
    },
    'hljs-deletion': {
      backgroundColor: '#440000', // Rouge très foncé fond
      color: pulsaiColors.AccentRed,
      display: 'inline-block',
      width: '100%',
    },
  },
  pulsaiColors,
);
import { AppFeature } from '../types';

interface GeneratedContent {
  fullDescription: string;
  features: AppFeature[];
}

export function generateDescriptionAndFeatures(
  shortSummary: string,
  appName: string,
  category: string
): GeneratedContent {
  const summary = shortSummary.trim();
  const name = appName.trim() || 'This application';
  const lowerSummary = summary.toLowerCase();

  // Extract key sentences or clauses
  const cleanSummary = summary.endsWith('.') ? summary : `${summary}.`;

  // Domain keyword detection
  let domain = 'utility';
  if (/educat|learn|course|study|quiz|flashcard|school|teach|language|math|exam|student/i.test(lowerSummary) || category === 'Education') {
    domain = 'education';
  } else if (/health|fitness|workout|gym|exercise|calorie|diet|step|running|sleep|water|yoga|meditat/i.test(lowerSummary) || category === 'Health & Fitness') {
    domain = 'fitness';
  } else if (/finance|money|budget|expense|wallet|crypto|coin|stock|invest|bank|currency|bill/i.test(lowerSummary) || category === 'Finance') {
    domain = 'finance';
  } else if (/secur|vpn|privacy|encrypt|vault|password|auth|shield|protect|firewall|safe/i.test(lowerSummary) || category === 'Security') {
    domain = 'security';
  } else if (/productiv|task|todo|note|plan|calendar|remind|organ|schedule|project|workflow/i.test(lowerSummary) || category === 'Productivity') {
    domain = 'productivity';
  } else if (/sport|score|match|team|league|live|gameplay|football|cricket|basketball|soccer/i.test(lowerSummary) || category === 'Sports') {
    domain = 'sports';
  } else if (/lifestyle|habit|daily|routine|journal|travel|weather|recipe|food|shop/i.test(lowerSummary) || category === 'Lifestyle') {
    domain = 'lifestyle';
  } else if (/media|music|player|audio|video|stream|podcast|radio|sound|record/i.test(lowerSummary) || category === 'Media') {
    domain = 'media';
  } else if (/chat|messag|talk|social|connect|forum|community|sms|call/i.test(lowerSummary) || category === 'Communication') {
    domain = 'communication';
  } else if (/game|puzzle|arcade|rpg|strategy|adventure|casual|player/i.test(lowerSummary) || category === 'Games') {
    domain = 'game';
  } else if (/developer|code|git|api|debug|terminal|json|script/i.test(lowerSummary) || category === 'Developer Tools') {
    domain = 'developer';
  }

  // Generate customized full descriptions and features based on detected domain & words
  let fullDescription = '';
  let features: AppFeature[] = [];

  const timestamp = Date.now();

  switch (domain) {
    case 'education':
      fullDescription = `${name} is an interactive educational software designed to elevate your learning process. ${cleanSummary}\n\nEngineered with an intuitive layout and focused user interface, it provides comprehensive study tools, structured practice modules, and timely performance feedback to help you master new concepts effectively.`;
      features = [
        {
          id: `feat_${timestamp}_1`,
          title: 'Structured Learning Modules',
          description: 'Comprehensive lessons and reference materials organized for progressive mastery.',
        },
        {
          id: `feat_${timestamp}_2`,
          title: 'Interactive Practice & Testing',
          description: 'Engaging quizzes and exercise routines designed for active recall.',
        },
        {
          id: `feat_${timestamp}_3`,
          title: 'Progress & Mastery Tracking',
          description: 'Real-time analytics and achievement milestones to monitor your educational growth.',
        },
        {
          id: `feat_${timestamp}_4`,
          title: 'Offline Study Mode',
          description: 'Access reference materials, revision sheets, and quizzes without requiring an active internet connection.',
        },
      ];
      break;

    case 'fitness':
      fullDescription = `${name} is a health and fitness companion created to streamline your physical well-being. ${cleanSummary}\n\nBuilt with performance-minded Android architecture, it delivers accurate tracking, goal setting, and insightful visual metrics to keep you motivated and consistent on your fitness journey.`;
      features = [
        {
          id: `feat_${timestamp}_1`,
          title: 'Activity & Routine Tracking',
          description: 'Log and monitor workouts, daily steps, and physical activities with high precision.',
        },
        {
          id: `feat_${timestamp}_2`,
          title: 'Custom Goal & Target Management',
          description: 'Set personalized targets and receive timely notifications to stay on track.',
        },
        {
          id: `feat_${timestamp}_3`,
          title: 'Visual Health Analytics',
          description: 'Detailed interactive charts breaking down your progress over days, weeks, and months.',
        },
        {
          id: `feat_${timestamp}_4`,
          title: 'Battery-Aware Design',
          description: 'Optimized sensor handling and lightweight local database for extended device battery life.',
        },
      ];
      break;

    case 'finance':
      fullDescription = `${name} is a financial management tool crafted for complete financial transparency. ${cleanSummary}\n\nFeaturing local data storage, it helps you budget smartly, categorize cash flow, and visualize expenditure habits without compromising your personal privacy.`;
      features = [
        {
          id: `feat_${timestamp}_1`,
          title: 'Intelligent Budget & Expense Tracking',
          description: 'Quickly record transactions with custom tags, categories, and payment methods.',
        },
        {
          id: `feat_${timestamp}_2`,
          title: 'Financial Breakdown & Insights',
          description: 'Clear visual summaries of your income vs expenses with monthly comparative reports.',
        },
        {
          id: `feat_${timestamp}_3`,
          title: 'Local Data Storage',
          description: 'Financial data handling is designed around local storage where supported.',
        },
        {
          id: `feat_${timestamp}_4`,
          title: 'Data Export & Backup',
          description: 'Export transaction summaries to CSV or JSON formats for easy accounting and backup.',
        },
      ];
      break;

    case 'security':
      fullDescription = `${name} is a security application with privacy-conscious features engineered to protect your digital identity and device data. ${cleanSummary}\n\nDesigned with privacy-conscious principles and appropriate security practices, it provides security-focused features for mobile devices.`;
      features = [
        {
          id: `feat_${timestamp}_1`,
          title: 'Cryptographic Security Features',
          description: 'Encryption features for credentials, data, and device storage where supported.',
        },
        {
          id: `feat_${timestamp}_2`,
          title: 'Privacy-Conscious Architecture',
          description: 'Designed to minimize unnecessary data collection and background activity.',
        },
        {
          id: `feat_${timestamp}_3`,
          title: 'Threat Monitoring Features',
          description: 'Helps monitor permissions and suspicious activity where supported.',
        },
        {
          id: `feat_${timestamp}_4`,
          title: 'Biometric & Local Lock Options',
          description: 'Supports fingerprint, face unlock, or local passphrase options where available.',
        },
      ];
      break;

    case 'productivity':
      fullDescription = `${name} is a high-efficiency productivity tool engineered to streamline your workflow and daily management. ${cleanSummary}\n\nDesigned with a distraction-free interface, it empowers you to organize tasks, capture ideas efficiently, and maintain momentum without friction.`;
      features = [
        {
          id: `feat_${timestamp}_1`,
          title: 'Intuitive Task & Content Organization',
          description: 'Easily prioritize, categorize, and schedule your daily agenda and key projects.',
        },
        {
          id: `feat_${timestamp}_2`,
          title: 'Smart Reminders & Notifications',
          description: 'Customizable alerts to help you keep track of critical deadlines and important milestones.',
        },
        {
          id: `feat_${timestamp}_3`,
          title: 'Fast Keyboard & Gesture Shortcuts',
          description: 'Rapid creation and organization tools designed for one-handed operation.',
        },
        {
          id: `feat_${timestamp}_4`,
          title: 'Offline Access',
          description: 'Supports offline access and selected features during low connectivity where applicable.',
        },
      ];
      break;

    case 'sports':
      fullDescription = `${name} is a dedicated sports companion delivering dynamic data, fixture tracking, and comprehensive stats. ${cleanSummary}\n\nStay connected to live scores, match analyses, and team standings with timely updates and customizable alerts.`;
      features = [
        {
          id: `feat_${timestamp}_1`,
          title: 'Live Score & Event Tracking',
          description: 'Updates on active matches, match timelines, and key highlights.',
        },
        {
          id: `feat_${timestamp}_2`,
          title: 'Comprehensive League Standings',
          description: 'Up-to-date tables, schedules, and head-to-head performance comparisons.',
        },
        {
          id: `feat_${timestamp}_3`,
          title: 'Custom Team & Match Alerts',
          description: 'Select your favorite clubs and tournaments for match notifications.',
        },
        {
          id: `feat_${timestamp}_4`,
          title: 'Lightweight & Fast Refresh',
          description: 'Designed for practical bandwidth usage and timely data synchronization.',
        },
      ];
      break;

    case 'lifestyle':
      fullDescription = `${name} is an everyday lifestyle application designed to bring clarity, consistency, and delight to your daily routine. ${cleanSummary}\n\nFeaturing an uncluttered, modern user experience, it helps you manage your day-to-day lifestyle goals with effortless grace.`;
      features = [
        {
          id: `feat_${timestamp}_1`,
          title: 'Daily Routine & Habit Tracking',
          description: 'Build positive lifestyle streaks and track ongoing habits effortlessly.',
        },
        {
          id: `feat_${timestamp}_2`,
          title: 'Personalized Daily Overview',
          description: 'A clean morning briefing highlighting your priorities and day outlook.',
        },
        {
          id: `feat_${timestamp}_3`,
          title: 'Clean Minimalist Atmosphere',
          description: 'Soothing visual aesthetics with full dark mode support to prevent eye strain.',
        },
        {
          id: `feat_${timestamp}_4`,
          title: 'Local Storage Options',
          description: 'Personal lifestyle logs can be stored locally where supported.',
        },
      ];
      break;

    case 'media':
      fullDescription = `${name} is a multimedia application offering playback controls, clean audio/video processing, and efficient library management. ${cleanSummary}\n\nBuilt for efficient media playback and practical resource usage.`;
      features = [
        {
          id: `feat_${timestamp}_1`,
          title: 'Audio & Video Playback',
          description: 'Crystal-clear playback supporting major formats and encoding standards.',
        },
        {
          id: `feat_${timestamp}_2`,
          title: 'Organized Media Library',
          description: 'Auto-categorization with custom playlists, favorites, and quick search.',
        },
        {
          id: `feat_${timestamp}_3`,
          title: 'Built-in Equalizer & Visual Controls',
          description: 'Fine-tune acoustic settings and playback speeds according to your preference.',
        },
        {
          id: `feat_${timestamp}_4`,
          title: 'Background Playback & Lock Screen Controls',
          description: 'Seamless uninterrupted playback while multitasking or with device screen off.',
        },
      ];
      break;

    default: // Utility / General
      fullDescription = `${name} is a utility application designed to provide reliable, standalone functionality for Android devices. ${cleanSummary}\n\nEngineered with a focus on speed, lightweight storage footprints, and clean usability, it delivers practical tools and swift performance for everyday use.`;
      features = [
        {
          id: `feat_${timestamp}_1`,
          title: 'Fast & Responsive Performance',
          description: 'Responsive application performance designed for smooth everyday use.',
        },
        {
          id: `feat_${timestamp}_2`,
          title: 'Clean & Intuitive Interface',
          description: 'Minimalist user interface allowing you to accomplish tasks in just a few taps.',
        },
        {
          id: `feat_${timestamp}_3`,
          title: 'Standalone & Offline Functionality',
          description: 'Works reliably without mandatory internet connections or external accounts.',
        },
        {
          id: `feat_${timestamp}_4`,
          title: 'Focused Application Experience',
          description: 'A focused utility experience with attention to unnecessary background activity and data use.',
        },
      ];
      break;
  }

  // If the summary contains specific distinct keyword phrases, refine the feature titles
  if (/calc|convert|unit|currency/i.test(lowerSummary)) {
    features[0] = {
      id: `feat_${timestamp}_calc`,
      title: 'Precision Calculation & Conversion',
      description: 'Accurate formulas and fast real-time conversion calculations.',
    };
  }
  if (/backup|sync|export|cloud|import/i.test(lowerSummary)) {
    features[1] = {
      id: `feat_${timestamp}_backup`,
      title: 'Reliable Data Backup & Restore',
      description: 'Easily export, backup, or transfer your configurations and data.',
    };
  }
  if (/offline|no internet|standalone/i.test(lowerSummary)) {
    features[3] = {
      id: `feat_${timestamp}_offline`,
      title: 'Offline Access',
      description: 'Supports offline use where applicable.',
    };
  }

  return { fullDescription, features };
}




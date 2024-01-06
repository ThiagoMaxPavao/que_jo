import pandas as pd

df = pd.read_csv('./words_syllables_pt_BR.csv', sep=',')

df['count_syllabic'] = df['syllabic_division'].str.count('-') + 1

df_filter = df[df['count_syllabic'] == 2]

df_filter = df_filter.drop('count_syllabic', axis=1)

df_filter[['syllable1', 'syllable2']] = df_filter['syllabic_division'].apply(lambda x: pd.Series(str(x).split("-")))

df_filter = df_filter.drop('syllabic_division', axis=1)

df_filter.reset_index()

df_filter.to_csv('./filter_two-syllable.csv', sep=',', index=False)
